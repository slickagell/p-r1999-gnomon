import {
  IMAGE_DEGREE_ORIENTATIONS,
  IMAGE_ORIENTATION,
} from "@constants/resonance";
import RESONANCE_PIECES from "@data/resonance/common/pieces.json";
import { centroid } from "@turf/centroid";
import { polygon } from "@turf/helpers";
import Alpine from "alpinejs";
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";
import { intersection, union } from "martinez-polygon-clipping";
import matrix from "matrix-js";
import { changeImageOrientation, getResonanceBoardRowCol } from "./common";

const BLOCK_SIZE = 30;
const BOARD_MARGIN_HORIZONTAL = 40;
const BOARD_MARGIN_VERTICAL = 40;

const MOBILE_BLOCK_SIZE = 28;
const MOBILE_BOARD_MARGIN_HORIZONTAL = 16;
const MOBILE_BOARD_MARGIN_VERTICAL = 16;

export default () => ({
  isOnMobile: false,
  boardCol: 0,
  boardRow: 0,
  boardMarginHorizontal: 0,
  boardMarginVertical: 0,
  boardRelativeX: 0,
  boardRelativeY: 0,
  boardX: 0,
  boardY: 0,

  activeResonanceLevel: 0,
  activeResonancePieces: [],
  resonancePatternPieces: [],
  maxPieceSize: 0,

  recommendedOptions: [],
  selectedRecommended: "",
  selectedPattern: "",
  initialRecommendedData: [],
  initialActiveResonancePieces: [],

  pieceShapeFilter: "",
  pieceBlocksFilter: "",

  initDragGeoJson: null,
  dragGeoJson: null,

  dragShape: [],
  dragShapeDimension: null,

  selectGeoJson: null,
  selectGeoJsonIdx: -1,
  selectPieceId: null,

  ctx: null,
  canvas: null,
  boardCtx: null,
  boardCanvas: null,

  resonanceGeoJson: null,
  itemOnBoardGeoJson: null,
  resonanceGeoJsonList: [],

  initBlocks: [],
  blocks: [],
  blockSize: 0,
  blockOffset: 0,

  startMouseX: 0,
  startMouseY: 0,
  lastMouseX: 0,
  lastMouseY: 0,
  isDragging: false,
  isMouseDown: false,

  //* Init board canvas and blocks array
  initCanvas() {
    this.canvas = this.$refs.canvas;
    this.boardCanvas = this.$refs.boardCanvas;
    this.ctx = this.$refs.canvas.getContext("2d");
    this.boardCtx = this.$refs.boardCanvas.getContext("2d");

    if (!this.boardRow || !this.boardCol) {
      const { row, col } = getResonanceBoardRowCol(this.activeResonanceLevel);

      this.boardRow = row;
      this.boardCol = col;
    }

    let initBlocks: ResonanceBlockType[] = [];
    for (let row = 0; row < this.boardRow; row++) {
      for (let col = 0; col < this.boardCol; col++) {
        initBlocks.push({
          id: `${row}-${col}`,
          col: col,
          row: row,
          pos: {
            x: col * this.blockSize,
            y: row * this.blockSize,
          },
          size: this.blockSize,
          isCollided: false,
        });
      }
    }

    this.initBlocks = JSON.parse(JSON.stringify(initBlocks));
    this.blocks = JSON.parse(JSON.stringify(initBlocks));

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.boardCanvas.width = this.boardCol * this.blockSize;
    this.boardCanvas.height = this.boardRow * this.blockSize;

    this.$nextTick(() => {
      const boardImgWidth = this.$refs.boardImg.width;
      const boardImgHeight = this.$refs.boardImg.height;
      this.boardRelativeX =
        (boardImgWidth - this.boardCol * this.blockSize) / 2;
      this.boardRelativeY =
        (boardImgHeight - this.boardRow * this.blockSize) / 2;
      this.boardX = this.boardMarginHorizontal + this.boardRelativeX;
      this.boardY = this.boardMarginVertical + this.boardRelativeY;
    });
  },

  init() {
    this.activeResonanceLevel =
      this.$store.resonance.initialActiveResonanceLevel;

    if (window.innerWidth < 768) {
      this.isOnMobile = true;
      this.blockSize = MOBILE_BLOCK_SIZE;
      this.boardMarginHorizontal = MOBILE_BOARD_MARGIN_HORIZONTAL;
      this.boardMarginVertical = MOBILE_BOARD_MARGIN_VERTICAL;
    } else {
      this.blockSize = BLOCK_SIZE;
      this.boardMarginHorizontal = BOARD_MARGIN_HORIZONTAL;
      this.boardMarginVertical = BOARD_MARGIN_VERTICAL;
    }
    this.blockOffset = this.blockSize / 4;

    this.initCanvas();
    this.initializeData(true);
  },

  initializeData(isFirstInit = false) {
    //* Init resonance pieces
    const activeResonancePieces = (
      this.$store.resonance.resonancePieces[this.activeResonanceLevel] || []
    ).reduce((prev, ele) => {
      const piece = RESONANCE_PIECES[ele.id];

      if (piece) {
        const dimension = matrix(piece.shape).size();
        this.maxPieceSize = Math.max(
          this.maxPieceSize,
          dimension[0],
          dimension[1]
        );

        if (piece.id.includes(this.$store.resonance.mainPieceCode)) {
          piece.stats = Object.entries(piece.stats).reduce(
            (prev, [level, stats]: [string, object]) => {
              return {
                ...prev,
                [level]: {
                  ...stats,
                },
              };
            },
            {}
          );
        }

        return [
          ...prev,
          {
            ...piece,
            dimension,
            total: ele.total,
            level: ele.level,
            orientation: 1,
          },
        ];
      }

      return prev;
    }, []);

    this.initialActiveResonancePieces = JSON.parse(
      JSON.stringify(activeResonancePieces)
    );
    this.activeResonancePieces = JSON.parse(
      JSON.stringify(activeResonancePieces)
    );

    if (isFirstInit) {
      this.selectedPattern = `PLACIDITY`;

      if (this.activeResonanceLevel >= 10) {
        //* Init recommended pattern
        if (this.$store.resonance.recommendedResonancePattern) {
          this.selectedPattern =
            this.$store.resonance.recommendedResonancePattern;
        }
      }
    } else {
      if (this.activeResonanceLevel < 10) {
        this.selectedPattern = `PLACIDITY`;
      }
    }

    this.updateActiveResonancePiecesWithPattern(this.selectedPattern);

    this.$nextTick(() => {
      //* Init recommended
      if (this.$store.resonance.recommendedResonanceList) {
        const recommendedLevelKey = Object.keys(
          this.$store.resonance.recommendedResonanceList
        ).find((item) =>
          item
            .split("-")
            .some((ele) => parseInt(ele) === this.activeResonanceLevel)
        );

        if (!recommendedLevelKey) {
          this.recommendedOptions = [];
          this.selectedRecommended = "";
          this.resonanceGeoJsonList = [];
          return;
        }

        const activeRecommendedResonanceList =
          this.$store.resonance.recommendedResonanceList[recommendedLevelKey];

        let defaultIndex = 0;
        const preferredIndex = activeRecommendedResonanceList.findIndex(
          (ele) => ele.isPreferred
        );
        if (preferredIndex !== -1) defaultIndex = preferredIndex;
        const defaultResonanceData =
          activeRecommendedResonanceList[defaultIndex];

        if (!defaultResonanceData) {
          this.recommendedOptions = [];
          this.selectedRecommended = "";
          return;
        }

        this.selectedRecommended = `${this.activeResonanceLevel}-${defaultIndex}`;

        this.recommendedOptions =
          this.$store.resonance.recommendedResonanceList[
            recommendedLevelKey
          ].map((item, idx) => ({
            label: item.name + (item.isPreferred ? " (Preferred)" : ""),
            value: `${this.activeResonanceLevel}-${idx}`,
          }));

        this.initRecommendedResonanceData(defaultResonanceData);
      }
    });
  },

  drawPoly(coords: Position[], ctx, fill: string) {
    if (!ctx) return;
    ctx.fillStyle = fill;

    ctx.beginPath();
    ctx.moveTo(coords[0][0], coords[0][1]);
    coords.forEach((point) => {
      ctx.lineTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.fill();
  },

  drawGeoJson(geoJsonData: Feature, ctx, fill: string) {
    if (geoJsonData.geometry.type === "Polygon") {
      this.drawPoly(geoJsonData.geometry.coordinates[0], ctx, fill);
    }

    if (geoJsonData.geometry.type === "MultiPolygon") {
      geoJsonData.geometry.coordinates.forEach((coords) => {
        this.drawPoly(coords[0], ctx, fill);
      });
    }
  },

  drawImageOnCanvas({
    ctx,
    image,
    x,
    y,
    width,
    height,
    orientation,
  }: {
    ctx: CanvasRenderingContext2D;
    image: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
    orientation?: number;
  }) {
    let img;

    if (!image.complete || !image.naturalWidth || !image.naturalHeight) {
      img = new Image();
      img.onload = () => drawHiddenCanvasToCanvas();
      img.src = image.src;
    } else {
      img = image;
      drawHiddenCanvasToCanvas();
    }

    function drawHiddenCanvasToCanvas() {
      const hiddenCanvas = document.createElement("canvas");
      const hiddenCtx = hiddenCanvas.getContext("2d");

      const isRotated90Deg = orientation === 6 || orientation === 8;

      const originWidth = isRotated90Deg ? height : width;
      const originHeight = isRotated90Deg ? width : height;

      hiddenCanvas.width = width;
      hiddenCanvas.height = height;

      if (!hiddenCtx) return;

      hiddenCtx.translate(width / 2, height / 2);

      hiddenCtx.rotate((IMAGE_ORIENTATION[orientation].deg * Math.PI) / 180);

      hiddenCtx.drawImage(
        img,
        -originWidth / 2,
        -originHeight / 2,
        originWidth,
        originHeight
      );

      ctx.drawImage(hiddenCanvas, x, y, width, height);

      hiddenCanvas.remove();
    }
  },

  drawResonanceGeoJsonList() {
    this.resonanceGeoJsonList.forEach((geoJson) => {
      if (!geoJson.properties) return;

      const width = geoJson.properties.shapeDimension.col * this.blockSize;
      const height = geoJson.properties.shapeDimension.row * this.blockSize;
      const orientation = geoJson.properties.orientation;

      const { x: startBlockX, y: startBlockY } = this.getStartBlockCoords(
        geoJson.properties.blocks
      );

      const image = document.querySelector(
        "img[data-piece-img-id=" + geoJson.properties?.pieceId + "]"
      ) as HTMLImageElement;

      this.drawImageOnCanvas({
        ctx: this.boardCtx,
        image: image,
        x: startBlockX,
        y: startBlockY,
        width: width,
        height: height,
        orientation: orientation,
      });
    });
  },

  updateBoardCanvas() {
    this.boardCtx.clearRect(
      0,
      0,
      this.boardCanvas.width,
      this.boardCanvas.height
    );
    this.drawResonanceGeoJsonList();
  },

  getStartBlockCoords(blocks?: string[]) {
    if (!blocks) return;

    let startBlockCol = this.boardCol;
    let startBlockRow = this.boardRow;

    blocks.forEach((ele) => {
      const [row, col] = ele.split("-");
      if (+col < startBlockCol) {
        startBlockCol = +col;
      }
      if (+row < +startBlockRow) {
        startBlockRow = +row;
      }
    });

    const startBlockX = startBlockCol * this.blockSize;
    const startBlockY = startBlockRow * this.blockSize;

    return {
      x: startBlockX,
      y: startBlockY,
    };
  },

  transformGeoJson(itemGeoJson: Feature, startPoint: { x: number; y: number }) {
    let transformGeoJson;

    if (itemGeoJson.geometry.type === "Polygon") {
      const startPolyPoint = itemGeoJson.geometry.coordinates[0][0];

      let delta = {
        x: startPoint.x - startPolyPoint[0],
        y: startPoint.y - startPolyPoint[1],
      };

      const transformCoords = itemGeoJson.geometry.coordinates[0].map(
        (point) => {
          return [point[0] + delta.x, point[1] + delta.y] as Position;
        }
      );

      transformGeoJson = {
        ...itemGeoJson,
        geometry: {
          ...itemGeoJson.geometry,
          coordinates: [transformCoords],
        },
      } as Feature<Polygon>;
    }

    if (itemGeoJson.geometry.type === "MultiPolygon") {
      const startPolyPoint = itemGeoJson.geometry.coordinates[0][0][0];

      const translatedCoords = itemGeoJson.geometry.coordinates.reduce(
        (prevPolysCoords, polys) => {
          const transformPolys = polys.reduce((prev: Position[], coords) => {
            let delta = {
              x: startPoint.x - startPolyPoint[0],
              y: startPoint.y - startPolyPoint[1],
            };
            const transformCoords = coords.map((point) => {
              return [point[0] + delta.x, point[1] + delta.y] as Position;
            });
            return [...prev, transformCoords];
          }, []);
          return [...prevPolysCoords, transformPolys];
        },
        []
      );

      transformGeoJson = {
        ...itemGeoJson,
        geometry: {
          ...itemGeoJson.geometry,
          coordinates: translatedCoords,
        },
      } as Feature<MultiPolygon>;
    }

    return { transformGeoJson };
  },

  initGeoJsonByShape(shape: number[][], initialX = 0, initialY = 0) {
    const blockShapeMatrix = matrix(shape);
    const blockShapeDimension = blockShapeMatrix.size();
    const shapeRow = blockShapeDimension[0];
    const shapeCol = blockShapeDimension[1];

    let itemBlocks: Position[][] = [];

    for (let row = 0; row < shapeRow; row++) {
      for (let col = 0; col < shapeCol; col++) {
        if (blockShapeMatrix(row, col)) {
          const x = col * this.blockSize;
          const y = row * this.blockSize;

          const itemBlock = [
            [x, y],
            [(col + 1) * this.blockSize, y],
            [(col + 1) * this.blockSize, (row + 1) * this.blockSize],
            [x, (row + 1) * this.blockSize],
          ];

          itemBlocks.push(itemBlock);
        }
      }
    }

    let itemGeoJson;
    itemBlocks.forEach((element) => {
      const eleBlock = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[...element, element[0]]],
        },
      } as Feature<Polygon>;

      if (!itemGeoJson) {
        itemGeoJson = eleBlock;
      } else {
        const newPolyBlockCoords = union(
          itemGeoJson.geometry.coordinates,
          eleBlock.geometry.coordinates
        );

        itemGeoJson = {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: newPolyBlockCoords,
          },
        };
      }
    });

    if (!initialX && !initialY) {
      return {
        shape: JSON.parse(JSON.stringify(shape)),
        shapeDimension: JSON.parse(JSON.stringify(blockShapeDimension)),
        itemGeoJson: JSON.parse(JSON.stringify(itemGeoJson)),
      };
    }

    const startPoint = {
      x: initialX,
      y: initialY,
    };

    const { transformGeoJson } = this.transformGeoJson(itemGeoJson, startPoint);

    return {
      shape: JSON.parse(JSON.stringify(shape)),
      shapeDimension: JSON.parse(JSON.stringify(blockShapeDimension)),
      itemGeoJson: JSON.parse(JSON.stringify(transformGeoJson)),
    };
  },

  onInitDragGeoJson() {
    const wrapper = document.querySelector(
      "div[data-piece-id=" + this.selectPieceId + "]"
    ) as HTMLDivElement;

    let pieceAlpineData: any = Alpine.$data(wrapper);

    const orientation = pieceAlpineData.orientation;

    pieceAlpineData.updateQuantity(-1);

    const blockData = RESONANCE_PIECES[this.selectPieceId];

    if (!blockData) return;

    this.isDragging = true;

    let rotateShape = blockData.shape;

    if (orientation > 1) {
      rotateShape = this.shapeRotate(blockData.shape, orientation);
    }

    const { shape, shapeDimension, itemGeoJson } =
      this.initGeoJsonByShape(rotateShape);

    this.dragShape = shape;
    this.dragShapeDimension = shapeDimension;
    this.initDragGeoJson = {
      ...itemGeoJson,
      properties: {
        ...itemGeoJson.properties,
        blocks: [],
        shape: shape,
        shapeDimension: {
          row: shapeDimension[0],
          col: shapeDimension[1],
        },
        orientation: orientation,
        pieceId: blockData.id,
      },
    };
  },

  calculatePointerPosition(event) {
    if (!this.canvas || !event) return { x: 0, y: 0 };
    let rect = this.canvas.getBoundingClientRect();

    let clientX;
    let clientY;

    if (event.type.includes("touch")) {
      clientX =
        event.changedTouches?.[0]?.clientX ?? event.touches?.[0]?.clientX;
      clientY =
        event.changedTouches?.[0]?.clientY ?? event.touches?.[0]?.clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  },

  onPointerDown(event) {
    const { x: clientX, y: clientY } = this.calculatePointerPosition(event);
    this.lastMouseX = clientX;
    this.lastMouseY = clientY;
    this.startMouseX = clientX;
    this.startMouseY = clientY;
    this.isMouseDown = true;

    if (!event.target.attributes["data-piece-id"]) {
      const { selectGeoJson, selectGeoJsonIdx } =
        this.checkSelectGeoJson(event);

      this.selectGeoJson = selectGeoJson;
      this.selectGeoJsonIdx = selectGeoJsonIdx;

      return;
    }
    const shapeId = event.target.attributes["data-piece-id"].value;
    let pieceAlpineData: any = Alpine.$data(event.target);
    if (!pieceAlpineData.quantity) return;
    this.selectPieceId = shapeId;
  },

  onPointerMove(event) {
    if (!this.isMouseDown) return;

    if (!this.isDragging) {
      const { x, y } = this.calculatePointerPosition(event);

      const delta = this.blockSize;
      const diffX = Math.abs(x - this.startMouseX);
      const diffY = Math.abs(y - this.startMouseY);

      if (!(diffX > delta || diffY > delta)) {
        return;
      }

      if (this.selectPieceId) {
        this.onInitDragGeoJson();
        return;
      }

      const selectGeoJson = this.selectGeoJson;
      const selectGeoJsonIdx = this.selectGeoJsonIdx;

      if (selectGeoJson) {
        if (selectGeoJsonIdx > -1) {
          this.resonanceGeoJsonList = JSON.parse(
            JSON.stringify(this.resonanceGeoJsonList)
          ).filter((_, idx) => idx !== selectGeoJsonIdx);
        }
        const blocksData = JSON.parse(JSON.stringify(this.blocks)).map(
          (block) => {
            if (selectGeoJson.properties?.blocks.includes(block.id)) {
              return {
                ...block,
                isCollided: false,
              };
            }
            return block;
          }
        );

        this.initBlocks = blocksData;
        this.blocks = blocksData;

        this.isDragging = true;
        const { shape, shapeDimension, itemGeoJson } = this.initGeoJsonByShape(
          selectGeoJson.properties?.shape
        );
        this.dragShape = shape;
        this.dragShapeDimension = shapeDimension;
        this.initDragGeoJson = {
          ...itemGeoJson,
          properties: {
            ...selectGeoJson.properties,
          },
        };
      }

      return;
    }

    const { x, y } = this.calculatePointerPosition(event);
    this.lastMouseX = x;
    this.lastMouseY = y;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const draggingGeoJson = Object.assign(this.initDragGeoJson, {}) as Feature;

    const centroidPoint = centroid(draggingGeoJson);

    const startPoint = {
      x: this.lastMouseX - centroidPoint.geometry.coordinates[0],
      y: this.lastMouseY - centroidPoint.geometry.coordinates[1],
    };

    const { transformGeoJson } = this.transformGeoJson(
      draggingGeoJson,
      startPoint
    );

    this.dragGeoJson = {
      ...transformGeoJson,
      properties: {
        ...this.initDragGeoJson.properties,
      },
    };

    this.drawGeoJson(this.dragGeoJson, this.ctx, "rgba(219, 111, 57,0.5)");
    this.blocks = JSON.parse(JSON.stringify(this.initBlocks));
    this.processCheckCollision(this.dragGeoJson, this.blocks, {
      x: this.boardX,
      y: this.boardY,
    });
  },

  onPointerUp(event) {
    this.isMouseDown = false;
    const { x, y } = this.calculatePointerPosition(event);
    const boardWidth = this.boardCanvas.width;
    const boardHeight = this.boardCanvas.height;

    //* Check if we're out of the board
    if (
      x < this.boardX ||
      x > this.boardX + boardWidth ||
      y < this.boardY ||
      y > this.boardY + boardHeight
    ) {
      //* If we're currently dragging a block
      if (this.isDragging) {
        this.processEndCollision();
      } else if (this.selectPieceId) {
        const wrapper = document.querySelector(
          "div[data-piece-id=" + this.selectPieceId + "]"
        ) as HTMLDivElement;
        let pieceAlpineData: any = Alpine.$data(wrapper);
        pieceAlpineData.selectPieceRotation();
        this.resetInitialState();
      }
      return;
    }

    const delta = this.blockSize;
    const diffX = Math.abs(x - this.startMouseX);
    const diffY = Math.abs(y - this.startMouseY);

    if (diffX > delta || diffY > delta) {
      //* If we're currently dragging a block
      if (this.isDragging) {
        this.processEndCollision();
        return;
      }

      return;
    }

    if (this.isDragging) return;

    //* User click on the board
    this.onBoardClick();
  },

  shapeRotate(originShape, orientation = 1) {
    //* Clone shape
    const shape = JSON.parse(JSON.stringify(originShape));
    const shapeMatrix = matrix(shape);

    switch (orientation) {
      //* Rotate 90deg
      case 6: {
        //* Transpose
        const rotateShapeMatrix = shapeMatrix.trans();

        //* Reverse rows
        for (let i = 0; i < rotateShapeMatrix.length; i++) {
          rotateShapeMatrix[i].reverse();
        }

        return rotateShapeMatrix;
      }
      //* Rotate 180deg
      case 3: {
        let rotateShape = shape;

        let [rows, cols] = shapeMatrix.size();

        if (rows % 2 !== 0) {
          // If N is odd reverse the middle
          // row in the matrix
          const index = Math.floor(rows / 2);
          let cols = rotateShape[index].length;
          for (let i = 0; i < cols / 2; i++) {
            rotateShape[index].reverse();
          }
        }

        // Swap the value of matrix [i][j]
        // with [rows - i - 1][cols - j - 1]
        // for half the rows size.
        for (let i = 0; i <= rows / 2 - 1; i++) {
          for (let j = 0; j < cols; j++) {
            let temp = rotateShape[i][j];
            rotateShape[i][j] = rotateShape[rows - i - 1][cols - j - 1];
            rotateShape[rows - i - 1][cols - j - 1] = temp;
          }
        }

        return rotateShape;
      }
      //* Rotate 270deg (-90deg)
      case 8: {
        let [rows, cols] = shapeMatrix.size();

        //* Transpose
        const rotateShapeMatrix = shapeMatrix.trans();

        //* Reverse cols
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols / 2; c++) {
            let temp = rotateShapeMatrix[c][r];
            rotateShapeMatrix[c][r] = rotateShapeMatrix[cols - c - 1][r];
            rotateShapeMatrix[cols - c - 1][r] = temp;
          }
        }

        return rotateShapeMatrix;
      }
      default: {
        return originShape;
      }
    }
  },

  resetInitialState() {
    this.selectGeoJson = null;
    this.dragGeoJson = null;
    this.initDragGeoJson = null;
    this.dragShape = [];
    this.dragShapeDimension = null;
    this.itemOnBoardGeoJson = null;
    this.isDragging = false;
    this.selectPieceId = null;
  },

  processEndCollision() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.itemOnBoardGeoJson) return;

    const pieceId = this.itemOnBoardGeoJson.properties.pieceId;
    const wrapper = document.querySelector(
      "div[data-piece-id=" + pieceId + "]"
    ) as HTMLDivElement;
    let pieceAlpineData: any = Alpine.$data(wrapper);

    const isItemInsideBoard = this.itemOnBoardGeoJson.geometry.coordinates
      .flat(this.itemOnBoardGeoJson.geometry.type === "MultiPolygon" ? 2 : 1)
      .every((point: Position) => {
        return (
          point[0] >= 0 &&
          point[1] >= 0 &&
          point[0] <= this.blockSize * this.boardCol &&
          point[1] <= this.blockSize * this.boardRow
        );
      });

    if (!isItemInsideBoard) {
      this.blocks = this.initBlocks;

      if (!this.isDragging) {
        if (this.selectGeoJson)
          this.resonanceGeoJsonList.push(this.selectGeoJson);
      }

      this.resetInitialState();
      this.updateBoardCanvas();

      pieceAlpineData.updateQuantity(1);
      return;
    }

    const blocks = JSON.parse(
      JSON.stringify(this.blocks)
    ) as ResonanceBlockType[];

    const invalidBlock = blocks.find((ele) => ele.isNotValid);
    if (!invalidBlock) {
      this.initBlocks = this.blocks;
      const unionGeoJson = !this.resonanceGeoJson
        ? this.itemOnBoardGeoJson
        : {
            type: "Feature",
            geometry: {
              coordinates: union(
                this.resonanceGeoJson.geometry.coordinates,
                this.itemOnBoardGeoJson.geometry.coordinates
              ),
            },
          };

      this.resonanceGeoJson = unionGeoJson;
      this.itemOnBoardGeoJson = {
        ...this.itemOnBoardGeoJson,
        properties: {
          ...this.itemOnBoardGeoJson.properties,
          shape: this.dragShape,
        },
      };

      this.resonanceGeoJsonList.push(this.itemOnBoardGeoJson);
    } else {
      this.blocks = this.initBlocks;
      // if (this.selectGeoJson) {
      //   this.resonanceGeoJsonList.push(this.selectGeoJson);
      // }
      pieceAlpineData.updateQuantity(1);
    }

    this.resetInitialState();
    this.updateBoardCanvas();
  },

  checkSelectGeoJson(event) {
    let selectGeoJson;
    let selectGeoJsonIdx = -1;

    const blockId = event.target.attributes["data-block-id"]?.value;

    if (!blockId)
      return {
        selectGeoJson,
        selectGeoJsonIdx,
      };

    const [row, col] = blockId.split("-");

    this.resonanceGeoJsonList.some((geoJson, idx) => {
      if (geoJson.properties.blocks.includes(`${row}-${col}`)) {
        selectGeoJson = geoJson;
        selectGeoJsonIdx = idx;
        return true;
      }

      return false;
    });

    return {
      selectGeoJson,
      selectGeoJsonIdx,
    };
  },

  onBoardClick() {
    const selectGeoJson = this.selectGeoJson;
    const selectGeoJsonIdx = this.selectGeoJsonIdx;

    if (!selectGeoJson || !selectGeoJson.properties) return;

    if (selectGeoJsonIdx > -1) {
      this.resonanceGeoJsonList = JSON.parse(
        JSON.stringify(this.resonanceGeoJsonList)
      ).filter((_, idx) => idx !== selectGeoJsonIdx);
    }

    const rotatedShape = this.shapeRotate(
      selectGeoJson.properties?.shape,
      IMAGE_DEGREE_ORIENTATIONS["90deg"]
    );

    const { x: startBlockX, y: startBlockY } = this.getStartBlockCoords(
      selectGeoJson.properties.blocks
    );

    const { itemGeoJson, shape, shapeDimension } = this.initGeoJsonByShape(
      rotatedShape,
      startBlockX,
      startBlockY
    );

    const newItemGeoJson = {
      ...itemGeoJson,
      properties: {
        ...selectGeoJson.properties,
        shape: shape,
        shapeDimension: {
          row: shapeDimension[0],
          col: shapeDimension[1],
        },
        orientation: changeImageOrientation(
          selectGeoJson.properties.orientation
        ),
      },
    };

    // this.drawGeoJson(itemGeoJson, this.ctx, "rgba(255, 233, 0, 1)");

    const blocksData = JSON.parse(JSON.stringify(this.blocks)).map((block) => {
      if (selectGeoJson.properties?.blocks.includes(block.id)) {
        return {
          ...block,
          isCollided: false,
        };
      }
      return block;
    });

    this.blocks = blocksData;
    this.dragShape = shape;
    this.dragShapeDimension = shapeDimension;

    this.processCheckCollision(newItemGeoJson, this.blocks);
    this.processEndCollision();
  },

  distanceBetween(
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  checkCollision(item: Feature<MultiPolygon>, block: ResonanceBlockType) {
    const blockStartPoint = [
      block.pos.x + this.blockOffset,
      block.pos.y + this.blockOffset,
    ];

    const blockSize = block.size - this.blockOffset * 2;

    const blockPoly = polygon([
      [
        [blockStartPoint[0], blockStartPoint[1]],
        [blockSize + blockStartPoint[0], blockStartPoint[1]],
        [blockSize + blockStartPoint[0], blockSize + blockStartPoint[1]],
        [blockStartPoint[0], blockSize + blockStartPoint[1]],
        [blockStartPoint[0], blockStartPoint[1]],
      ],
    ]);

    //* Draw potential collide block
    // this.drawGeoJson(blockPoly, this.ctx, "rgba(220,220,220,1)");

    const intersectionPoly = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: intersection(
          item.geometry.coordinates,
          blockPoly.geometry.coordinates
        ),
      },
    };

    if (
      !intersectionPoly.geometry.coordinates ||
      !intersectionPoly.geometry.coordinates?.[0]
    ) {
      return false;
    }

    return true; // Collision detected
  },

  processCheckCollision(
    item: Feature,
    blocks: ResonanceBlockType[],
    offsetDraggingPoint = { x: 0, y: 0 }
  ) {
    const bufferRadius =
      this.blockSize * (Math.max(...this.dragShapeDimension) / 2 + 1); // (slightly larger than the sweepRadius) is the maximum distance between the item's position and a block's position that is considered "far enough" to warrant pruning the block from the search space

    let geoJson;

    if (item.geometry.type === "Polygon") {
      const startPoint = item.geometry.coordinates[0][0];

      const column = Math.floor(
        (startPoint[0] - offsetDraggingPoint.x) / this.blockSize
      );
      const row = Math.floor(
        (startPoint[1] - offsetDraggingPoint.y) / this.blockSize
      );

      const { transformGeoJson } = this.transformGeoJson(item, {
        x: column * this.blockSize,
        y: row * this.blockSize,
      });

      geoJson = {
        ...transformGeoJson,
        properties: {
          ...transformGeoJson.properties,
          blocks: [],
        },
      };
    } else if (item.geometry.type === "MultiPolygon") {
      const startPoint = item.geometry.coordinates[0][0][0];

      const column = Math.floor(
        (startPoint[0] - offsetDraggingPoint.x) / this.blockSize
      );
      const row = Math.floor(
        (startPoint[1] - offsetDraggingPoint.y) / this.blockSize
      );

      const { transformGeoJson } = this.transformGeoJson(item, {
        x: column * this.blockSize,
        y: row * this.blockSize,
      });

      geoJson = {
        ...transformGeoJson,
        properties: {
          ...transformGeoJson.properties,
          blocks: [],
        },
      };
    }

    const centroidPoint = centroid(geoJson);

    for (const block of blocks) {
      const idx = blocks.indexOf(block);

      const distance = this.distanceBetween(
        {
          x: centroidPoint.geometry.coordinates[0],
          y: centroidPoint.geometry.coordinates[1],
        },
        {
          x: block.pos.x + this.blockSize / 2,
          y: block.pos.y + this.blockSize / 2,
        }
      );

      if (distance > bufferRadius) continue;

      //* Draw item on canvas
      //this.drawGeoJson(geoJson, this.ctx, "rgba(219, 111, 57, 0.1)");

      const collision = this.checkCollision(geoJson, block);

      if (collision) {
        if (blocks[idx].isCollided) {
          blocks[idx].isNotValid = true;
        } else {
          blocks[idx].isCollided = true;
          geoJson.properties?.blocks.push(blocks[idx].id);
        }
        // return true; // Collision detected, return true
      }
    }

    this.itemOnBoardGeoJson = geoJson;

    return false; // No collision detected
  },

  changeResonanceLevel(level: number) {
    const { row, col } = getResonanceBoardRowCol(level);
    this.activeResonanceLevel = level;
    this.boardCol = col;
    this.boardRow = row;

    this.initCanvas();
    this.resetPiecesQuantity();
    this.resetGeneralStats();
    this.initializeData();
  },

  printResonanceGeoJsonList() {
    const list = this.resonanceGeoJsonList.map((ele) => {
      const { blocks, shape, orientation, pieceId } = ele.properties;
      return {
        blocks,
        shape,
        orientation,
        pieceId,
      };
    });

    return JSON.stringify(list);
  },

  initResonanceGeoJsonList(
    list: {
      blocks: string[];
      shape: number[][];
      orientation: number;
      pieceId: string;
    }[]
  ) {
    const geoJsonList = list.reduce((prev, item) => {
      const { x: startBlockX, y: startBlockY } = this.getStartBlockCoords(
        item.blocks
      );

      const { itemGeoJson, shapeDimension } = this.initGeoJsonByShape(
        item.shape,
        startBlockX,
        startBlockY
      );

      const newItemGeoJson = {
        ...itemGeoJson,
        properties: {
          ...item,
          shapeDimension: {
            row: shapeDimension[0],
            col: shapeDimension[1],
          },
        },
      };

      return [...prev, newItemGeoJson];
    }, []);

    return geoJsonList;
  },

  initResonanceData(resonanceData) {
    //* Update resonanceGeoJson
    this.resonanceGeoJsonList = this.initResonanceGeoJsonList(
      resonanceData.resonance
    );

    const { pieces, blocksList } = this.resonanceGeoJsonList.reduce(
      (
        prev: {
          pieces: {
            [pieceId: string]: {
              quantity: number;
            };
          };
          blocksList: string[];
        },
        geoJson
      ) => {
        const pieceId = geoJson.properties?.pieceId;
        if (prev.pieces?.[pieceId]) {
          return {
            ...prev,
            blocksList: prev.blocksList.concat(geoJson.properties?.blocks),
            pieces: {
              ...prev.pieces,
              [pieceId]: {
                quantity: prev.pieces[pieceId].quantity + 1,
              },
            },
          };
        }

        return {
          ...prev,
          blocksList: prev.blocksList.concat(geoJson.properties?.blocks),
          pieces: {
            ...prev.pieces,
            [pieceId]: {
              quantity: 1,
            },
          },
        };
      },
      {
        pieces: {},
        blocksList: [],
      }
    );

    //* Update piece quantities
    Object.entries(pieces).forEach(
      ([pieceId, piece]: [string, { quantity: number }]) => {
        const pieceDiv = document.querySelector(
          "div[data-piece-id=" + pieceId + "]"
        ) as HTMLDivElement;

        let pieceAlpineData: any = Alpine.$data(pieceDiv);

        pieceAlpineData.updateQuantity(-(piece?.quantity || 0));
      }
    );

    //* Update blocks
    const blocksData = this.blocks.map((block) => {
      if (blocksList.includes(block.id)) {
        return {
          ...block,
          isCollided: true,
        };
      }
      return { ...block, isCollided: false };
    });

    this.initBlocks = blocksData;
    this.blocks = blocksData;

    this.$nextTick(() => {
      this.updateBoardCanvas();
    });
  },

  initRecommendedResonanceData(resonanceData) {
    this.initialRecommendedData = resonanceData;
    this.initResonanceData(resonanceData);
  },

  updateActiveResonancePiecesWithPattern(pattern) {
    if (pattern === "PLACIDITY") {
      this.activeResonancePieces = JSON.parse(
        JSON.stringify(this.initialActiveResonancePieces)
      );
      return;
    }

    const pieceCode = this.$store.resonance.mainPieceCode;

    const patternPiece = this.$store.resonance.patternPieces.find((piece) =>
      piece.id.includes(pattern)
    );

    if (!patternPiece) return;

    const updatedActiveResonancePieces = this.initialActiveResonancePieces.map(
      (piece) => {
        if (piece.id.includes(pieceCode)) {
          return {
            ...piece,
            image: patternPiece.image,
            stats: Object.entries(patternPiece.stats).reduce(
              (prev, [level, stats]: [string, object]) => {
                return {
                  ...prev,
                  [level]: {
                    ...stats,
                  },
                };
              },
              {}
            ),
            pattern: pattern,
          };
        } else {
          return piece;
        }
      }
    );

    this.activeResonancePieces = updatedActiveResonancePieces;
  },

  changeRecommended(value: string) {
    const [resonanceLevel, index] = value.split("-");
    const recommendedLevelKey = Object.keys(
      this.$store.resonance.recommendedResonanceList
    ).find((item) => item.split("-").some((ele) => ele === resonanceLevel));

    if (!recommendedLevelKey) return;

    const resonanceData =
      this.$store.resonance.recommendedResonanceList[recommendedLevelKey][
        index
      ];

    this.selectedRecommended = value;

    this.resetPiecesQuantity();
    this.resetGeneralStats();
    this.initRecommendedResonanceData(resonanceData);
  },

  changePattern(value: string) {
    this.selectedPattern = value;

    this.updateActiveResonancePiecesWithPattern(value);

    if (value === "PLACIDITY") {
      this.$nextTick(() => {
        this.resetPiecesQuantity();
        this.resetGeneralStats();
        this.initResonanceData(this.initialRecommendedData);
      });
      return;
    }

    const pieceCode = this.$store.resonance.mainPieceCode;

    this.$nextTick(() => {
      const newResonanceData = this.initialRecommendedData.resonance.map(
        (item) => {
          if (item.pieceId.includes(pieceCode)) {
            return {
              ...item,
              pattern: value,
            };
          } else {
            return item;
          }
        }
      );

      this.resetPiecesQuantity();
      this.resetGeneralStats();
      this.initResonanceData({ resonance: newResonanceData });
    });
  },

  resetPiecesQuantity() {
    const pieceDivs = document.querySelectorAll(
      "div[data-piece-id]"
    ) as NodeListOf<HTMLDivElement>;

    pieceDivs.forEach((pieceDiv) => {
      const pieceAlpineData: any = Alpine.$data(pieceDiv);
      pieceAlpineData.resetQuantity();
    });
  },

  resetGeneralStats() {
    const generalStatsDiv = document.querySelector(
      "#generalStats"
    ) as HTMLDivElement;
    const generalStatsAlpineData: any = Alpine.$data(generalStatsDiv);
    generalStatsAlpineData.resetGeneralStats();
  },

  onResizeWindow() {
    if (window.innerWidth < 768) {
      if (this.isOnMobile) return;
      this.isOnMobile = true;
      this.blockSize = MOBILE_BLOCK_SIZE;
      this.boardMarginHorizontal = MOBILE_BOARD_MARGIN_HORIZONTAL;
      this.boardMarginVertical = MOBILE_BOARD_MARGIN_VERTICAL;
    } else {
      if (!this.isOnMobile) return;
      this.isOnMobile = false;
      this.blockSize = BLOCK_SIZE;
      this.boardMarginHorizontal = BOARD_MARGIN_HORIZONTAL;
      this.boardMarginVertical = BOARD_MARGIN_VERTICAL;
    }
    this.blockOffset = this.blockSize / 4;
    this.reCalculateBoardSize();
  },

  onResize({ width, height }: { width: number; height: number }) {
    this.canvas.width = width;
    this.canvas.height = height;
  },

  reCalculateBoardSize() {
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
    this.boardCtx.clearRect(0, 0, this.boardCtx.width, this.boardCtx.height);

    this.resetInitialState();
    this.resetPiecesQuantity();
    this.resetGeneralStats();
    this.initCanvas();
    this.initializeData();
  },

  clearBoard() {
    this.boardCtx.clearRect(
      0,
      0,
      this.boardCanvas.width,
      this.boardCanvas.height
    );
    this.resonanceGeoJsonList = [];
    const blocksData = this.blocks.map((block) => ({
      ...block,
      isCollided: false,
    }));
    this.initBlocks = blocksData;
    this.blocks = blocksData;

    this.resetInitialState();
    this.resetPiecesQuantity();
    this.resetGeneralStats();
  },

  filterShowPieces(id: string) {
    const [pieceType, pieceShape, pieceBlocks, pieceId] = id.split("_");
    return (
      (this.pieceShapeFilter === pieceShape || !this.pieceShapeFilter) &&
      (this.pieceBlocksFilter === pieceBlocks || !this.pieceBlocksFilter)
    );
  },
});

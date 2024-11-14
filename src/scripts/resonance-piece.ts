import {
  IMAGE_ORIENTATION,
  RESONANCE_PIECES,
  changeImageOrientation,
} from "@data/resonance";
import matrix from "matrix-js";

export default ({ id, total = 1, orientation = 1 }) => ({
  id: id,
  quantity: total,
  total: total,
  orientation: orientation,

  setQuantity(quantity: number) {
    this.quantity = quantity;
  },

  updateQuantity(updateQuantity: number) {
    const newQuantity = parseInt(this.quantity) + updateQuantity;
    this.quantity = newQuantity;
  },

  resetQuantity() {
    this.quantity = this.total;
  },

  selectPieceRotation() {
    const container = this.$el;
    const wrapper = container.querySelector("div[data-piece-id=" + id + "]");
    const image = container.querySelector(
      "img[data-piece-img-id=" + id + "]",
    ) as HTMLImageElement;

    if (!image || !wrapper) return;
    const piece = RESONANCE_PIECES[id];
    const dimension = matrix(piece.shape).size();
    let newDimension = dimension;

    const currentOrientation = +(this.orientation || 1);

    const newOrientation = changeImageOrientation(currentOrientation);

    const currentOrientationStyle = IMAGE_ORIENTATION[currentOrientation].style;
    const newOrientationStyle = IMAGE_ORIENTATION[newOrientation].style;

    if (newOrientation === 6 || newOrientation === 8) {
      //* [row, col]
      newDimension = [dimension[1], dimension[0]];
      image.style.left = `${((dimension[0] - newDimension[0]) * this.blockSize) / 2}px`;
      image.style.top = `${((dimension[1] - newDimension[1]) * this.blockSize) / 2}px`;
    } else {
      image.style.left = `0px`;
      image.style.top = `0px`;
    }

    image.classList.remove(currentOrientationStyle);
    image.classList.add(newOrientationStyle);

    this.orientation = newOrientation;

    wrapper.style.width = `${newDimension[1] * this.blockSize}px`;
    wrapper.style.height = `${newDimension[0] * this.blockSize}px`;
  },
});

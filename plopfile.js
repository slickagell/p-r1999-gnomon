import { character, artefact, effect, material } from "./plops/index.js";

export default function (plop) {
  plop.addHelper("if", function (v1, operator, v2, options) {
    switch (operator) {
      case "==":
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case "===":
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case "!=":
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case "!==":
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case "<":
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case "<=":
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case ">":
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case ">=":
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case "&&":
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case "||":
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  plop.addHelper("switch", function (value, options) {
    this.switch_value = value;
    this.switch_break = false;
    return options.fn(this);
  });

  plop.addHelper("case", function (value, options) {
    if (value == this.switch_value) {
      this.switch_break = true;
      return options.fn(this);
    }
  });

  plop.addHelper("default", function (value, options) {
    if (this.switch_break == false) {
      return value;
    }
  });

  plop.setGenerator("Character content", character);
  plop.setGenerator("Artefact content", artefact);
  plop.setGenerator("Effect content", effect);
  plop.setGenerator("Material content", material);
}

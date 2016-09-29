import React from 'react';
import Three from 'three';
import {loadObjWithMaterial} from '../../utils/load-obj';

let pathSVG = React.createFactory('path');
let lineSVG = React.createFactory('line');
let gSVG = React.createFactory('g');

export default {
  name: "door",
  prototype: "holes",

  info: {
    tag: ['porta'],
    group: "Comunicazione orizzontale",
    description: "Porta di legno",
    image: require('./door.png')
  },

  properties: {
    width: {
      type: "number",
      defaultValue: 80,
      min: 0
    },
    height: {
      type: "number",
      defaultValue: 215,
      min: 0
    },
    altitude: {
      type: "number",
      defaultValue: 0,
      min: 0
    }
  },

  render2D: function (hole, layer, scene) {
    const STYLE_HOLE_BASE = {stroke: "#000", strokeWidth: "3px", fill: "#000"};
    const STYLE_HOLE_SELECTED = {stroke: "orange", strokeWidth: "3px", fill: "orange"};

    //let line = layer.lines.get(hole.line);
    //let epsilon = line.properties.get('thickness') / 2;

    let epsilon = 3;

    let holeWidth = hole.properties.get('width');
    let holePath = `M${0} ${ -epsilon}  L${holeWidth} ${-epsilon}  L${holeWidth} ${epsilon}  L${0} ${epsilon}  z`;
    let holeStyle = hole.selected ? STYLE_HOLE_SELECTED : STYLE_HOLE_BASE;

    return gSVG({}, [
      pathSVG({
        key: 1,
        d: holePath,
        style: holeStyle
      }),
      lineSVG({
        key: 2,
        x1: holeWidth / 2 - 5,
        y1: -10 - epsilon,
        x2: holeWidth / 2 - 5,
        y2: 10 + epsilon,
        style: holeStyle
      }),
      lineSVG({
        key: 3,
        x1: holeWidth / 2 + 5,
        y1: -10 - epsilon,
        x2: holeWidth / 2 + 5,
        y2: 10 + epsilon,
        style: holeStyle
      }),
    ]);
  },

  render3D: function(hole, layer, scene) {
    let onLoadItem = (object) => {
      let boundingBox = new Three.Box3().setFromObject(object);

      let initialWidth = boundingBox.max.x - boundingBox.min.x;
      let initialHeight = boundingBox.max.y - boundingBox.min.y;
      let initialThickness = boundingBox.max.z - boundingBox.min.z;

      if (hole.selected) {
        let box = new Three.BoxHelper(object, 0x99c3fb);
        box.material.linewidth = 2;
        box.material.depthTest = false;
        object.add(box);
      }

      object.scale.set(hole.properties.get('width') / initialWidth, hole.properties.get('height') / initialHeight,
        hole.thickness / initialThickness);

      return object;
    };

    return loadObjWithMaterial('obj/door/', 'door.mtl', 'obj/door/',
      'door.obj', onLoadItem)
      .then(object => onLoadItem(object));

  }
};
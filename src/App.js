import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DxfParser from "dxf-parser";

import './App.css';
class InputFileReader extends Component {
  constructor() {
    super();
    this.myRef = React.createRef();
    this.state = {
      isDfxParsed: false
    }
  };
  handleClick = () => {
    let input = this.refs.input_reader;
    input.click();
  };
  inputFileChanged = (e) => {
    if (window.FileReader) {
      let file = e.target.files[0], reader = new FileReader(), self = this;
      reader.readAsText(file);

      reader.onloadend = function (evt) {
        const fileReader = evt.target;

        const parser = new DxfParser();
        const dxf = parser.parseSync(fileReader.result);

        let font;
        const loader = new window.THREE.FontLoader();

        loader.load('fonts/helvetiker_regular.typeface.json', function (response) {
          font = response;
          const canvas = self.myRef.current

          new window.ThreeDxf.Viewer(dxf, canvas, 400, 400, font);
          self.setState({ isDfxParsed: true });

        });
      }
    }
    else {
      alert('Soryy, your browser does\'nt support for preview');
    }
  }

  render() {
    const { isDfxParsed } = this.state
    return (
      <div className='container'>
        <button className='uploadBtn' onClick={this.handleClick}>Upload</button>
        {
          isDfxParsed && <p>While hovering over the canvas: Right click to pan. Mouse wheel to zoom in an out.</p>
        }
        <input type="file" ref="input_reader"
          style={{ display: 'none' }} onChange={this.inputFileChanged} />
        <div id="cad-view" ref={this.myRef}>
        </div>
      </div>
    );
  }
}

InputFileReader.propTypes = {
  accept: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  capture: PropTypes.bool,
  multiple: PropTypes.bool
}
export default InputFileReader;
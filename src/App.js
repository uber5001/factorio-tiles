import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function range(n) {
  return new Array(n).fill(null).map((x,i)=>i);
}

class App extends Component {
  

  render() {
    return (
      <div className="App">
        <FactorioTiles width={48} height={24}></FactorioTiles>
        <div className="App-description">
          <h1>Factorio-Tiles</h1>
          <p>This is a potential solution to the problems presented in <a href="https://www.factorio.com/blog/post/fff-199">FFF-199</a>.</p>
          <h2>Instructions</h2>
          <p>Left click to place grass. <br/> Right click to place water. <br/> Scroll to zoom. </p>
          <h3>Premise</h3>
          <p>Tiles in factorio currently represent the <em>transition</em> between multiple types of terrain (e.g.: grass to water is a little cliff). Each grid square is of a single terrain type. This means that <strong>tiles should be rendered in between grid squares</strong>. This demo has shifted the tiles to be rendered on the intersections of the grid, instead of the grid squares themselves. The marching squares algorithm can be used to determine which tile should be rendered.</p>
          <p>tl;dr; Use marching squares</p>
          <h3>Note</h3>
          <p>This demo uses mostly original tiles from the game, with the exception of <a href="images/LWWL.png">this tile</a> and <a href="images/WLLW.png">this tile</a>.</p>
          <h3>See Also</h3>
          <p><a href="https://www.reddit.com/r/factorio/comments/6nlzzs/my_idea_about_friday_facts_199/">Reddit: "My idea about Friday Facts #199"</a> posted by <a href="https://www.reddit.com/user/Dkluwe">Dkluwe</a></p>
        </div>
      </div>
    );
  }
}

class FactorioTiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: new Array(props.width * props.height).fill("X"),
      zoom: 64,
      currentDrawingTile: null
    };

    this.handleWheel = this.handleWheel.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleMouseMoveOverTile = this.handleMouseMoveOverTile.bind(this);
  }

  handleWheel(event) {
    event.preventDefault();
    const nextZoom = event.deltaY < 0
      ? this.state.zoom * Math.pow(2, 1/4)
      : this.state.zoom * Math.pow(2, -1/4)
    this.setState({
      zoom: Math.max(8, Math.min(128, nextZoom))
    });
    return false;
  }

  handleDragStart(event) {
    event.preventDefault();
    this.setState({currentDrawingTile: event.button == 0 ? "L" : "W"})
  }

  handleDragStop(event) {
    event.preventDefault();
    this.setState({currentDrawingTile: null})
  }

  handleMouseMoveOverTile(event, x, y, mouseDownEvent) {
    if (!this.state.currentDrawingTile && !mouseDownEvent) return;
    const index = x + y * this.props.width
    const tiles = this.state.tiles.slice(0)
    tiles.splice(index, 1, mouseDownEvent ? (event.button == 0 ? "L" : "W") : this.state.currentDrawingTile );
    this.setState({tiles});
  }

  handleContextMenu(event) {
    event.preventDefault();
    return false;
  }

  getTile(x, y) {
    const index = x + y * this.props.width
    return this.state.tiles[index];
  }

  getImageForTile(x, y) {
    const topLeft = this.getTile(x, y);
    const topRight = this.getTile(x+1, y);
    const bottomLeft = this.getTile(x, y+1);
    const bottomRight = this.getTile(x+1, y+1);
    const hasX = topLeft == "X" || topRight == "X" || bottomLeft == "X" || bottomRight == "X";
    return hasX
      ? <img src={"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}></img>
      : <img src={"images/" + topLeft + topRight + bottomLeft + bottomRight + ".png"}></img>
  }

  render() {
    const style = {
      fontSize: this.state.zoom + "px"
    }
    const {x, y} = this.state;
    return (
      <div 
        className="FactorioTiles"
        style={style}
        onWheel={this.handleWheel}
        onMouseDown={this.handleDragStart}
        onMouseUp={this.handleDragStop}
        onMouseLeave={this.handleDragStop}
        onContextMenu={this.handleContextMenu}
      >
        <table className="FactorioTiles-raw">
          <tbody>
          {
            range(this.props.height).map(y => (
              <tr>
              {
                range(this.props.width).map(x => (
                  <td className={this.getTile(x, y)}></td>
                ))
              }
              </tr>
            ))
          }
          </tbody>
        </table>
        <table className="FactorioTiles-render">
          <tbody>
          {
            range(this.props.height - 1).map(y => (
              <tr>
              {
                range(this.props.width - 1).map(x => (
                  <td>
                  {
                    this.getImageForTile(x, y)
                  }
                  </td>
                ))
              }
              </tr>
            ))
          }
          </tbody>
        </table>

        <table className="FactorioTiles-grid">
          <tbody>
          {
            range(this.props.height).map(y => (
              <tr>
              {
                range(this.props.width).map(x => (
                  <td
                    onMouseEnter={(event) => this.handleMouseMoveOverTile(event, x, y)}
                    onMouseDown={(event) => this.handleMouseMoveOverTile(event, x, y, true)}
                  ></td>
                ))
              }
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default App;

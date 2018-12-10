import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LayoutChooser.styl';

/**
 * Adds the 'hover' class to cells above and to the left of the current cell
 * This is used to "fill in" the grid that the user will change the layout to,
 * if they click on a specific table cell.
 **/

export class LayoutChooser extends Component {
  constructor(props) {
    super(props);
    this.emptyCell = { row: -1, col: -1 };
    this.state = {
      table: [[]],
      selectedCell: this.emptyCell
    };
    this.highlightCells = this.highlightCells.bind(this);
    this.isRange = this.isRange.bind(this);
  }
  componentDidMount() {
    this.highlightCells(this.emptyCell);
  }
  onClick(currentCell) {
    this.setState({
      selectedCell: currentCell
    });
    this.highlightCells(currentCell);
    if (this.props.onClick) {
      this.props.onClick(currentCell);
    }
    if (this.props.onChange) {
      this.props.onChange(currentCell);
    }
  }
  isRange(cell, parentCell) {
    return cell.row <= parentCell.row && cell.col <= parentCell.col;
  }
  highlightCells(currentCell) {
    let table = [];
    for (let row = 0; row < this.props.rows; row++) {
      let newRow = [];
      for (let col = 0; col < this.props.columns; col++) {
        let cell = { row: row, col: col };
        if (this.isRange(cell, currentCell)) {
          cell.className = 'hover';
        } else if (
          this.isRange(currentCell, this.emptyCell) &&
          this.isRange(cell, this.state.selectedCell)
        ) {
          cell.className = 'selectedBefore';
        }
        newRow.push(cell);
      }
      table.push(newRow);
    }
    this.setState({ table: table });
  }

  render() {
    let columns = this.props.columns;
    const style = {
      display: this.props.visible ? 'block' : 'none',
      minWidth:
        columns * this.props.boxSize + (columns + 5) * this.props.cellBorder
    };
    return (
      <div
        className="layoutChooser pull-left dropdown-menu"
        role="menu"
        style={style}
      >
        <table>
          <tbody>
            {this.state.table.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((cell, j) => {
                    return (
                      <td
                        className={cell.className}
                        style={{
                          width: this.props.boxSize,
                          height: this.props.boxSize,
                          border: 'solid 1px black'
                        }}
                        key={j}
                        onMouseEnter={() => this.highlightCells(cell)}
                        onMouseLeave={() => this.highlightCells(this.emptyCell)}
                        onClick={() => this.onClick(cell)}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
LayoutChooser.defaultProps = {
  rows: 3,
  columns: 3,
  visible: true,
  boxSize: 20,
  cellBorder: 1
};
LayoutChooser.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  boxSize: PropTypes.number.isRequired,
  cellBorder: PropTypes.number.isRequired
};
export default LayoutChooser;
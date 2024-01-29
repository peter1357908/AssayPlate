import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AssayPlate = ({ currPlate, setCurrPlate }) => {

  // render the current plate
  // const renderCells = () => {
  //   const cells = [];
  //   for (let row = 0; row < numRows; row++) {
  //     for (let col = 0; col < numCols; col++) {
  //       cells.push(
  //         <circle
  //           key={`${row}-${col}`}
  //           cx={col * 30}
  //           cy={row * 30}
  //           r={10}
  //           fill={colors[row][col]}
  //           onClick={() => handleCellClick(row, col)}
  //           style={{ cursor: 'pointer' }}
  //         />
  //       );
  //     }
  //   }
  //   return cells;
  // };

  return (
    <>
      <div className="assay-plate">
        <h4>
          assay plate placeholder
        </h4>
      </div>
    </>
  );
};

export default AssayPlate;
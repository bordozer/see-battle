import React from 'react';

import ShipRoomsCollector from 'src/utils/ship-rooms-collector'
import {getCellsByFilter} from 'src/utils/cells-utils'
import {randomElement} from 'src/utils/random-utils'

function _initShips() {
    return [
        {id: 11, name: 'Patrol Boat 1', size: 1, cells: [], damage: 0},
        {id: 12, name: 'Patrol Boat 2', size: 1, cells: [], damage: 0},
        {id: 13, name: 'Patrol Boat 3', size: 1, cells: [], damage: 0},
        {id: 14, name: 'Patrol Boat 4', size: 1, cells: [], damage: 0},
        {id: 21, name: 'Destroyer 1', size: 2, cells: [], damage: 0},
        {id: 22, name: 'Destroyer 2', size: 2, cells: [], damage: 0},
        {id: 31, name: 'Destroyer 3', size: 2, cells: [], damage: 0},
        {id: 32, name: 'Cruiser 1', size: 3, cells: [], damage: 0},
        {id: 33, name: 'Cruiser 2', size: 3, cells: [], damage: 0},
        {id: 41, name: 'Battleship', size: 4, cells: [], damage: 0},
        // {id: 51, name: 'Carrier', size: 5, cells: [], damage: 0}
    ]
}

function isFreeForShipCell(cell) {
    return !cell.ship && !cell.isShipNeighbor;
}

function _setNeighborCellsProperty(cells, cell, property) {
    const cellWithNeighbors = getCellWithNeighbors(cells, cell);
    // console.log("cell", cell);
    // console.log("cellWithNeighbors", cellWithNeighbors);
    cellWithNeighbors.forEach(neighborCell => {
        neighborCell[property] = true;
    })
}

export const getCellWithNeighbors = (cells, shipCell) => {
    const result = [];
    for (let y = shipCell.y - 1; y <= shipCell.y + 1; y++) {
        if (!cells[y]) {
            continue;
        }
        for (let x = shipCell.x - 1; x <= shipCell.x + 1; x++) {
            const neighborCell = cells[y][x];
            if (neighborCell && !neighborCell.ship) {
                // console.log("cells[y][x]", neighborCell);
                result.push(neighborCell);
            }
        }
    }
    return result;
};

export const markAllShipNeighborCellsAsKilled = (ship, cells) => {
    const killedShipCells = [];
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[i][j];
            if (cell.ship && cell.ship.id === ship.id) {
                killedShipCells.push(cell);
            }
        }
    }

    killedShipCells.forEach(cell => {
        _setNeighborCellsProperty(cells, cell, 'isKilledShipNeighborCell');
    })
};

export const generateShips = (cells) => {
    const ships = _initShips();

    ships.reverse().forEach(ship => {
        const shipSize = ship.size;

        let shipRoom;
        if (shipSize > 1) {
            const spaciousRooms = new ShipRoomsCollector(1).collectRooms(cells, shipSize, isFreeForShipCell);
            const shipRooms = spaciousRooms.hFreeRooms.concat(spaciousRooms.vFreeRooms);
            shipRoom = randomElement(shipRooms);
        } else {
            shipRoom = {
                roomCells: [randomElement(getCellsByFilter(cells, isFreeForShipCell))]
            };
        }

        shipRoom.roomCells.forEach(cell => {
            cell.ship = ship;
        });
        shipRoom.roomCells.forEach(cell => {
            _setNeighborCellsProperty(cells, cell, 'isShipNeighbor');
        });
    });
    return {
        cells: cells,
        ships: ships
    };
};

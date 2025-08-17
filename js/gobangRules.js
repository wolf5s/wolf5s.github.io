function judgeTransverseContinuity(chess, type, row, col) { //判断横向连续
  var length = 4,
    start;
  limitLeft = Math.max(0, col - length),
    limitRight = Math.min(14, col + length);
  var continuity = 0,
    flag = true;
  for (var j = limitLeft; j <= limitRight; j++) {
    if (j === col) {
      flag = false;
    }
    if (chess[row][j] === type) {
      continuity++;
    } else {
      if (flag) {
        continuity = 0;
      } else {
        break;
      }
    }
    startX = j + 1 - continuity;
  }
  return {
    'position': continuity,
    'startX': startX
  };
}

function judgePortraitContinuity(chess, type, row, col) { //判断纵向连续
  var length = 4,
    limitTop = Math.max(0, row - length),
    limitBottom = Math.min(14, row + length);
  var continuity = 0,
    flag = true;
  for (var i = limitTop; i <= limitBottom; i++) {
    if (i === row) {
      flag = false;
    }
    if (chess[i][col] === type) {
      continuity++;
    } else {
      if (flag) {
        continuity = 0;
      } else {
        break;
      }
    }
    startY = i + 1 - continuity;
  }
  return {
    'position': continuity,
    'startY': startY
  };
}

function judgeInclinedContinuity(chess, type, row, col) { //判断正斜连续
  var continuity = 0,
    flag = true;
  for (var i = row - 4, j = col + 4, len = 0; len < 9; i++, j--, len++) {
    if (i < 0 || j < 0 || i > 14 || j > 14) {
      continue;
    }
    if (i === row && j === col) {
      flag = false;
    }
    if (chess[i][j] === type) {
      continuity++;
    } else {
      if (flag) {
        continuity = 0;
      } else {
        break;
      }
    }
    startX = j - 1 + continuity;
    startY = i + 1 - continuity;
  }
  return {
    'position': continuity,
    'startX': startX,
    'startY': startY
  };
}

function judgeAntiInclinedContinuity(chess, type, row, col) { //判断反斜连续
  var continuity = 0,
    flag = true;
  for (var i = row - 4, j = col - 4, len = 0; len < 9; i++, j++, len++) {
    if (i < 0 || j < 0 || i > 14 || j > 14) {
      continue;
    }
    if (i === row && j === col) {
      flag = false;
    }
    if (chess[i][j] === type) {
      continuity++;
    } else {
      if (flag) {
        continuity = 0;
      } else {
        break;
      }
    }
    startX = j + 1 - continuity;
    startY = i + 1 - continuity;
  }
  return {
    'position': continuity,
    'startX': startX,
    'startY': startY
  };
}

/*
 连续判断模型
 *
 * @chess {Array(15)(15)} 传入棋盘二维数组数据
 *
 * @type {Number} 当前落子类型
 *
 * @row {Number} 当前行数
 *
 * @col {Number} 当前列数
 *
 * @startX {Number} 当前行数起始位置
 *
 * @startY {Number} 当前列数起始位置
 *
 * @length {Number} 连子长度
 *
 * @direction {Number} 连子方向，1至4依次为横向、竖向、正斜、反斜
 *
 * @return {Array} 计算得出的最佳落子点
 */
function judgeContinuityModel(chess, type, row, col, startX, startY, length, direction) {
  var simulationChess, listPosition, len, correct;
  var listPosition4 = [0, 5],
    listPosition3 = [0, 1, 5, 6],
    listPosition2 = [0, 1, 2, 5, 6, 7],
    listPosition1 = [0, 1, 2, 3, 5, 6, 7, 8];
  switch (length) {
    case 1:
      correct = 4;
      listPosition = listPosition1;
      simulationChess = [false, false, false, false, type, false, false, false, false];
      break;
    case 2:
      correct = 3;
      listPosition = listPosition2;
      simulationChess = [false, false, false, type, type, false, false, false];
      break;
    case 3:
      correct = 2;
      listPosition = listPosition3;
      simulationChess = [false, false, type, type, type, false, false];
      break;
    case 4:
      correct = 1;
      listPosition = listPosition4;
      simulationChess = [false, type, type, type, type, false];
      break;
  }
  for (var i = 0, len = listPosition.length; i < len; i++) {
    var index = listPosition[i];
    switch (direction) {
      case 1:
        simulationChess[index] = simTransverseChess(chess, type, row, startX, index - correct);
        break;
      case 2:
        simulationChess[index] = simPortraitChess(chess, type, col, startY, index - correct);
        break;
      case 3:
        simulationChess[index] = simInclinedChess(chess, type, startX, startY, index - correct);
        break;
      case 4:
        simulationChess[index] = simAntiInclinedChess(chess, type, startX, startY, index - correct);
        break;
    }
  }
  return simulationChess;
}

function simTransverseChess(chess, type, row, startX, position) { //横向模型类型
  var falseType = (type + 1) % 2;
  if (position < 0) {
    if (startX + position < 0 || chess[row][startX + position] === falseType) {
      return falseType;
    }
  } else {
    if (startX + position > 14 || chess[row][startX + position] === falseType) {
      return falseType;
    }
  }
  if (chess[row][startX + position] === type) {
    return type;
  } else {
    return false;
  }
}

function simPortraitChess(chess, type, col, startY, position) { //纵向模型类型
  var falseType = (type + 1) % 2;
  if (position < 0) {
    if (startY + position < 0 || chess[startY + position][col] === falseType) {
      return falseType;
    }
  } else {
    if (startY + position > 14 || chess[startY + position][col] === falseType) {
      return falseType;
    }
  }
  if (chess[startY + position][col] === type) {
    return type;
  } else {
    return false;
  }
}

function simInclinedChess(chess, type, startX, startY, position) { //正斜模型类型
  var falseType = (type + 1) % 2;
  if (position < 0) {
    if (startY + position < 0 || startX - position > 14 ||
      chess[startY + position][startX - position] === falseType) {
      return falseType;
    }
  } else {
    if (startY + position > 14 || startX - position < 0 ||
      chess[startY + position][startX - position] === falseType) {
      return falseType;
    }
  }
  if (chess[startY + position][startX - position] === type) {
    return type;
  } else {
    return false;
  }
}

function simAntiInclinedChess(chess, type, startX, startY, position) { //反斜模型类型
  var falseType = (type + 1) % 2;
  if (position < 0) {
    if (startY + position < 0 || startX + position < 0 ||
      chess[startY + position][startX + position] === falseType) {
      return falseType;
    }
  } else {
    if (startY + position > 14 || startX + position > 14 ||
      chess[startY + position][startX + position] === falseType) {
      return falseType;
    }
  }
  if (chess[startY + position][startX + position] === type) {
    return type;
  } else {
    return false;
  }
}


function judgeForbiddenMoves(chess, i, j, type) {
  var chessType = {
    alive3: 0,
    alive4: 0,
    long: 0
  }
  chess[i][j] = type;

  var falseType = (type + 1) % 2;

  //横向
  switch (judgeTransverseContinuity(chess, type, i, j).position) {
    case 5:
      chess[i][j] = false;
      return false;
      break;
    case 4:
      scoreContinuity4(judgeContinuityModel(chess, type, i, 0, judgeTransverseContinuity(chess, type, i, j).startX, 0, 4, 1), type, falseType);
      break;
    case 3:
      scoreContinuity3(judgeContinuityModel(chess, type, i, 0, judgeTransverseContinuity(chess, type, i, j).startX, 0, 3, 1), type, falseType);
      break;
    case 2:
      scoreContinuity2(judgeContinuityModel(chess, type, i, 0, judgeTransverseContinuity(chess, type, i, j).startX, 0, 2, 1), type, falseType);
      break;
    case 1:
      scoreContinuity1(judgeContinuityModel(chess, type, i, 0, judgeTransverseContinuity(chess, type, i, j).startX, 0, 1, 1), type, falseType);
      break;
    default:
      chessType.long++;
  }

  //纵向
  switch (judgePortraitContinuity(chess, type, i, j).position) {
    case 5:
      chess[i][j] = false;
      return false;
      break;
    case 4:
      scoreContinuity4(judgeContinuityModel(chess, type, 0, j, 0, judgePortraitContinuity(chess, type, i, j).startY, 4, 2), type, falseType);
      break;
    case 3:
      scoreContinuity3(judgeContinuityModel(chess, type, 0, j, 0, judgePortraitContinuity(chess, type, i, j).startY, 3, 2), type, falseType);
      break;
    case 2:
      scoreContinuity2(judgeContinuityModel(chess, type, 0, j, 0, judgePortraitContinuity(chess, type, i, j).startY, 2, 2), type, falseType);
      break;
    case 1:
      scoreContinuity1(judgeContinuityModel(chess, type, 0, j, 0, judgePortraitContinuity(chess, type, i, j).startY, 1, 2), type, falseType);
      break;
    default:
      chessType.long++;
  }

  //正斜
  switch (judgeInclinedContinuity(chess, type, i, j).position) {
    case 5:
      chess[i][j] = false;
      return false;
      break;
    case 4:
      scoreContinuity4(judgeContinuityModel(chess, type, 0, 0, judgeInclinedContinuity(chess, type, i, j).startX, judgeInclinedContinuity(chess, type, i, j).startY, 4, 3), type, falseType);
      break;
    case 3:
      scoreContinuity3(judgeContinuityModel(chess, type, 0, 0, judgeInclinedContinuity(chess, type, i, j).startX, judgeInclinedContinuity(chess, type, i, j).startY, 3, 3), type, falseType);
      break;
    case 2:
      scoreContinuity2(judgeContinuityModel(chess, type, 0, 0, judgeInclinedContinuity(chess, type, i, j).startX, judgeInclinedContinuity(chess, type, i, j).startY, 2, 3), type, falseType);
      break;
    case 1:
      scoreContinuity1(judgeContinuityModel(chess, type, 0, 0, judgeInclinedContinuity(chess, type, i, j).startX, judgeInclinedContinuity(chess, type, i, j).startY, 1, 3), type, falseType);
      break;
    default:
      chessType.long++;
  }

  //反斜
  switch (judgeAntiInclinedContinuity(chess, type, i, j).position) {
    case 5:
      chess[i][j] = false;
      return false;
      break;
    case 4:
      scoreContinuity4(judgeContinuityModel(chess, type, 0, 0, judgeAntiInclinedContinuity(chess, type, i, j).startX, judgeAntiInclinedContinuity(chess, type, i, j).startY, 4, 4), type, falseType);
      break;
    case 3:
      scoreContinuity3(judgeContinuityModel(chess, type, 0, 0, judgeAntiInclinedContinuity(chess, type, i, j).startX, judgeAntiInclinedContinuity(chess, type, i, j).startY, 3, 4), type, falseType);
      break;
    case 2:
      scoreContinuity2(judgeContinuityModel(chess, type, 0, 0, judgeAntiInclinedContinuity(chess, type, i, j).startX, judgeAntiInclinedContinuity(chess, type, i, j).startY, 2, 4), type, falseType);
      break;
    case 1:
      scoreContinuity1(judgeContinuityModel(chess, type, 0, 0, judgeAntiInclinedContinuity(chess, type, i, j).startX, judgeAntiInclinedContinuity(chess, type, i, j).startY, 1, 4), type, falseType);
      break;
    default:
      chessType.long++;
  }

  chess[i][j] = false;

  if (sumChessType()) {
    return true;
  } else {
    return false;
  }

  function scoreContinuity4(simulationChess, type, falseType) { //连4得分
    if (simulationChess[0] === false && simulationChess[5] === false) {
      chessType.alive4++
    } else if (simulationChess[0] === falseType && simulationChess[5] === falseType) {
      //nothing
    } else if (simulationChess[0] === false || simulationChess[5] === false) {
      chessType.alive4++;
    }
  }

  function scoreContinuity3(simulationChess, type, falseType) { //连3得分
    if (simulationChess[1] === false && simulationChess[5] === false) {
      chessType.alive3++;
    }
    if (simulationChess[0] === type && simulationChess[1] === false &&
      simulationChess[5] === false && simulationChess[6] === type) {
      chessType.alive4 += 2;
    }
  }

  function scoreContinuity2(simulationChess, type, falseType) { //连2得分
    if (simulationChess[2] === false && simulationChess[5] === false) {
      if (simulationChess[6] === type && simulationChess[7] === type &&
        simulationChess[1] === type && simulationChess[0] === type) {
        chessType.alive4 += 2;
      }
      if (simulationChess[6] === type && simulationChess[7] === false ||
        simulationChess[1] === type && simulationChess[0] === false) {
        chessType.alive3++;
      }
    }
  }

  function scoreContinuity1(simulationChess, type, falseType) { //单1得分
    if (simulationChess[3] === false && simulationChess[5] === false &&
      simulationChess[6] === type && simulationChess[7] === type && simulationChess[8] === false) {
      chessType.alive4++;
    }
    if (simulationChess[0] === false && simulationChess[1] === type &&
      simulationChess[2] === type && simulationChess[3] === false && simulationChess[5] === false) {
      chessType.alive4++;
    }
  }

  function sumChessType() {
    if (chessType.alive4 + chessType.alive3 >= 2) {
      return true;
    }
    if (chessType.long >= 1) {
      return true;
    }
    return false;
  }
}
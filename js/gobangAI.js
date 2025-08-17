/*
 五子棋人工智障AI
 *
 * @chess {Array(15)(15)} 棋盘二维数组数据
 *
 * @currentPlayer {Number} 当前落子player
 *
 * @forbiddenMoves {Boolean} 是否先手禁手
 *
 * @return {Object(2)} 计算得出的最佳落子点
 */
function amai(chess, currentPlayer, forbiddenMoves) {
  var AIchess = {
    we: [],
    other: []
  }

  AIchess.we = new Array(15);
  AIchess.other = new Array(15);

  // 逐格打分
  for (var i = 0; i < 15; i++) {
    AIchess.we[i] = new Array(15);
    AIchess.other[i] = new Array(15);
    for (var j = 0; j < 15; j++) {
      AIchess.we[i][j] = 0;
      AIchess.other[i][j] = 0;
      if (chess[i][j] !== false) {
        continue;
      }
      _AIScore(i, j, currentPlayer, AIchess.we, true);
      _AIScore(i, j, (currentPlayer + 1) % 2, AIchess.other, false);
    }
  }

  var tempPosition, i = 7,
    j = 7,
    direction = 0,
    limit = 1; //初始化tempPosition位置
  outer: while (true) {
    var len = limit,
      flag = true;
    for (p = 0; p < len; p++) {
      if (data.chess[i][j] === false) {
        tempPosition = [i, j];
        break outer;
      }
      switch (direction) {
        case 0:
          i--;
          break;
        case 1:
          j++;
          if (flag) {
            limit++;
            flag = false
          };
          break;
        case 2:
          i++;
          break;
        case 3:
          j--;
          if (flag) {
            limit++;
            flag = false
          };
          break;
      }
    }
    direction = (direction + 1) % 4;
  }

  var wePosition = [tempPosition],
    otherPosition = [tempPosition],
    weScoreMax = 0,
    otherScoreMax = 0;
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (chess[i][j] !== false) {
        continue;
      }
      if (parseInt(AIchess.we[i][j]) > weScoreMax) {
        weScoreMax = parseInt(AIchess.we[i][j]);
        wePosition = [
          [i, j]
        ];
      } else if (parseInt(AIchess.we[i][j]) === weScoreMax) {
        wePosition.push([i, j]);
      }
      if (parseInt(AIchess.other[i][j]) > otherScoreMax) {
        otherScoreMax = parseInt(AIchess.other[i][j]);
        otherPosition = [
          [i, j]
        ];
      } else if (parseInt(AIchess.other[i][j]) === otherScoreMax) {
        otherPosition.push([i, j]);
      }
    }
  }

  if (weScoreMax >= otherScoreMax) {
    if (wePosition.length === 1) {
      tempPosition = wePosition[0];
    } else {
      tempPosition = _maxPosition(wePosition, AIchess.other, wePosition[0]);
    }
  } else {
    if (otherPosition.length === 1) {
      tempPosition = otherPosition[0];
    } else {
      tempPosition = _maxPosition(otherPosition, AIchess.we, otherPosition[0]);
    }
  }

  function _maxPosition(currentPosition, compareChess, tempPosition) {
    var position = tempPosition,
      maxScore = 0;
    for (var i = 0; i < currentPosition.length; i++) {
      if (compareChess[currentPosition[i][0]][currentPosition[i][1]] > maxScore) {
        maxScore = compareChess[currentPosition[i][0]][currentPosition[i][1]];
        position = [currentPosition[i][0], currentPosition[i][1]];
      }
    }
    return position;
  }

  return {
    'x': tempPosition[1],
    'y': tempPosition[0]
  };

  function _AIScore(i, j, type, AIchess, attack) { //判断得分
    chess[i][j] = type;

    var chessType = {
      die4: 0,
      alive4: 0,
      die3: 0,
      alive3: 0,
      die2: 0,
      alive2: 0,
      nearTransverse: 0,
      nearOblique: 0
    }

    var falseType = (type + 1) % 2;

    //横向
    switch (judgeTransverseContinuity(chess, type, i, j).position) {
      case 5:
        AIchess[i][j] += 100000;
        chess[i][j] = false;
        return;
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
    }

    //纵向
    switch (judgePortraitContinuity(chess, type, i, j).position) {
      case 5:
        AIchess[i][j] += 100000;
        chess[i][j] = false;
        return;
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
    }

    //正斜
    switch (judgeInclinedContinuity(chess, type, i, j).position) {
      case 5:
        AIchess[i][j] += 100000;
        chess[i][j] = false;
        return;
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
    }

    //反斜
    switch (judgeAntiInclinedContinuity(chess, type, i, j).position) {
      case 5:
        AIchess[i][j] += 100000;
        chess[i][j] = false;
        return;
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
    }

    nearby(type, i, j);

    sumChessScore(i, j, attack);

    chess[i][j] = false;

    function scoreContinuity4(simulationChess, type, falseType) { //连4得分
      if (simulationChess[0] === false && simulationChess[5] === false) {
        chessType.alive4++
      } else if (simulationChess[0] === falseType && simulationChess[5] === falseType) {
        //nothing
      } else if (simulationChess[0] === false || simulationChess[5] === false) {
        chessType.die4++;
      }
    }

    function scoreContinuity3(simulationChess, type, falseType) { //连3得分
      if (simulationChess[1] === false && simulationChess[5] === false) {
        if (simulationChess[0] === falseType && simulationChess[6] === falseType) { //均为对手棋子
          chessType.die3++;
        } else if (simulationChess[0] === type || simulationChess[6] === type) { //只要一个为自己的棋子
          chessType.die4++;
        } else if (simulationChess[0] === false || simulationChess[6] === false) { //只要有一个空
          chessType.alive3++;
        }
      } else if (simulationChess[1] === falseType && simulationChess[5] === falseType) {
        //nothing
      } else if (simulationChess[1] === false || simulationChess[5] === false) {
        if (simulationChess[1] === falseType) {
          if (simulationChess[6] === false) {
            chessType.die3++;
          } else if (simulationChess[6] === type) {
            chessType.die4++;
          }
        }
        if (simulationChess[5] === falseType) {
          if (simulationChess[0] === false) {
            chessType.die3++;
          } else if (simulationChess[0] === type) {
            chessType.die4++;
          }
        }
      }
    }

    function scoreContinuity2(simulationChess, type, falseType) { //连2得分
      if (simulationChess[2] === false && simulationChess[5] === false) {
        if (simulationChess[6] === false && simulationChess[7] === type ||
          simulationChess[1] === false && simulationChess[0] === type) {
          chessType.die3++;
        } else if (simulationChess[1] === false && simulationChess[6] === false) {
          chessType.alive2++;
        }
        if (simulationChess[6] === type && simulationChess[7] === falseType ||
          simulationChess[1] === type && simulationChess[0] === falseType) {
          chessType.die3++;
        }
        if (simulationChess[6] === type && simulationChess[7] === type ||
          simulationChess[1] === type && simulationChess[0] === type) {
          chessType.die4++;
        }
        if (simulationChess[6] === type && simulationChess[7] === false ||
          simulationChess[1] === type && simulationChess[0] === false) {
          chessType.alive3++;
        }
      } else if (simulationChess[1] === falseType && simulationChess[5] === falseType) {
        //nothing
      } else if (simulationChess[2] === false || simulationChess[5] === false) {
        if (simulationChess[2] === falseType) {
          if (simulationChess[6] === falseType || simulationChess[7] === falseType) {
            //nothing
          } else if (simulationChess[6] === false || simulationChess[7] === false) {
            chessType.die2++;
          } else if (simulationChess[6] === type && simulationChess[7] === type) {
            chessType.die4++;
          } else if (simulationChess[6] === type || simulationChess[7] === type) {
            chessType.die3++;
          }
        }
        if (simulationChess[5] === falseType) {
          if (simulationChess[1] === falseType || simulationChess[0] === falseType) {
            //nothing
          } else if (simulationChess[1] === false || simulationChess[0] === false) {
            chessType.die2++;
          } else if (simulationChess[1] === type && simulationChess[0] === type) {
            chessType.die4++;
          } else if (simulationChess[1] === type || simulationChess[0] === type) {
            chessType.die3++;
          }
        }
      }
    }

    function scoreContinuity1(simulationChess, type, falseType) { //单1得分
      if (simulationChess[3] === false && simulationChess[2] === type &&
        simulationChess[1] === type && simulationChess[0] === type) {
        chessType.die4++;
      }
      if (simulationChess[5] === false && simulationChess[6] === type &&
        simulationChess[7] === type && simulationChess[8] === type) {
        chessType.die4++;
      }
      if (simulationChess[3] === false && simulationChess[2] === type &&
        simulationChess[1] === type && simulationChess[0] === false &&
        simulationChess[5] === false) {
        chessType.alive3++;
      }
      if (simulationChess[5] === false && simulationChess[6] === type &&
        simulationChess[7] === type && simulationChess[8] === false &&
        simulationChess[3] === false) {
        chessType.alive3++;
      }
      if (simulationChess[3] === false && simulationChess[2] === type &&
        simulationChess[1] === type && simulationChess[0] === falseType &&
        simulationChess[5] === false) {
        chessType.die3++;
      }
      if (simulationChess[5] === false && simulationChess[6] === type &&
        simulationChess[7] === type && simulationChess[8] === falseType &&
        simulationChess[3] === false) {
        chessType.die3++;
      }
      if (simulationChess[3] === false && simulationChess[2] === false &&
        simulationChess[1] === type && simulationChess[0] === type) {
        chessType.die3++;
      }
      if (simulationChess[5] === false && simulationChess[6] === false &&
        simulationChess[7] === type && simulationChess[8] === type) {
        chessType.die3++;
      }
      if (simulationChess[3] === false && simulationChess[2] === type &&
        simulationChess[1] === false && simulationChess[0] === type) {
        chessType.die3++;
      }
      if (simulationChess[5] === false && simulationChess[6] === type &&
        simulationChess[7] === false && simulationChess[8] === type) {
        chessType.die3++;
      }
      if (simulationChess[3] === false && simulationChess[2] === type &&
        simulationChess[1] === false && simulationChess[0] === false &&
        simulationChess[5] === false) {
        chessType.alive2++;
      }
      if (simulationChess[5] === false && simulationChess[6] === type &&
        simulationChess[7] === false && simulationChess[8] === false &&
        simulationChess[3] === false) {
        chessType.alive2++;
      }
      if (simulationChess[3] === false && simulationChess[2] === false &&
        simulationChess[1] === type && simulationChess[0] === false &&
        simulationChess[5] === false) {
        chessType.alive2++;
      }
      if (simulationChess[5] === false && simulationChess[6] === false &&
        simulationChess[7] === type && simulationChess[8] === false &&
        simulationChess[3] === false) {
        chessType.alive2++;
      }
    }

    function nearby(type, row, col) {
      var falseType = (type + 1) % 2;
      var positionTransverse = [
        [row - 1, col],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col]
      ];
      positionOblique = [
        [row - 1, col - 1],
        [row - 1, col + 1],
        [row + 1, col - 1],
        [row + 1, col + 1]
      ];
      for (var i = 0, len = positionTransverse.length; i < len; i++) {
        try {
          if (chess[positionTransverse[i][0]][positionTransverse[i][1]] === type) {
            chessType.nearTransverse++;
          }
          if (chess[positionOblique[i][0]][positionOblique[i][1]] === type) {
            chessType.nearOblique++;
          }
        } catch (e) {
          //nothing
        }
      }
    }

    function sumChessScore(i, j, attack) {
      if (chessType.alive4 >= 1) {
        AIchess[i][j] += 20000;
      }
      if (chessType.die4 >= 2 || chessType.die4 >= 1 && chessType.alive3 >= 1) {
        AIchess[i][j] += 10000;
      }
      if (chessType.alive3 >= 2) {
        AIchess[i][j] += 5000;
      }
      if (chessType.die3 >= 1 && chessType.alive3 >= 1) {
        AIchess[i][j] += 1000;
      }
      if (chessType.die4 >= 1) {
        AIchess[i][j] += 500;
      }
      if (chessType.alive3 >= 1) {
        if (attack) {
          AIchess[i][j] += 500;
        } else {
          AIchess[i][j] += 100;
        }
      }
      if (chessType.alive2 >= 2) {
        AIchess[i][j] += 50;
      }
      if (chessType.alive2 >= 1) {
        AIchess[i][j] += 10;
      }
      if (chessType.die3 >= 1) {
        AIchess[i][j] += 5;
      }
      if (chessType.die2 >= 1) {
        AIchess[i][j] += 2;
      }
      if (chessType.nearTransverse >= 1) {
        AIchess[i][j] += 1.5;
      }
      if (chessType.nearOblique >= 1) {
        AIchess[i][j] += 1;
      }
      AIchess[i][j] += 1 - Math.abs(j - 7) / 14 - Math.abs(i - 7) / 14;
      if (forbiddenMoves && currentPlayer === 0 && judgeForbiddenMoves(chess, i, j, 0)) {
        AIchess[i][j] = -1;
      }
    }
  }
}
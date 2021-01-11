var soundOne = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
);
var soundTwo = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
);
var soundThree = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
);
var soundFour = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
);

var colors = ["red", "blue", "green", "yellow"];

var couples = {
  red: { firstColor: "#ff0000", secondColor: "#ff6d6d", sound: soundOne },
  blue: { firstColor: "#0004ff", secondColor: "#6365ff", sound: soundTwo },
  green: { firstColor: "#10a500", secondColor: "#52ff3f", sound: soundThree },
  yellow: { firstColor: "#ada900", secondColor: "#fffc68", sound: soundFour }
};

var playerSequence = [];
var pcSequence = [];
var count = 0;
var playing = 0;

function retry(event) {
  pcSequence.forEach(function(val, index) {
    setTimeout(function() {
      $("#" + val).css("background-color", couples[val]["secondColor"]);
      couples[val]["sound"].play();
      $.doTimeout(1000, function() {
        $("#" + val).css("background-color", couples[val]["firstColor"]);
      });
    }, index * 1500);
  });
}

function game(event) {
  $("#instr").remove();
  playing = 1;
  var randNum = Math.floor(Math.random() * 4);
  pcSequence.push(colors[randNum]);
  pcSequence.forEach(function(val, index) {
    setTimeout(function() {
      $("#" + val).css("background-color", couples[val]["secondColor"]);
      couples[val]["sound"].play();
      $.doTimeout(1000, function() {
        $("#" + val).css("background-color", couples[val]["firstColor"]);
        $("#curr").remove();
      });
    }, index * 1500);
  });
  playerSequence = [];
}

function changeColor(event) {
  if (playing == 1 && count < 21) {
    var checked = document.getElementById("strict").checked;
    $("#" + event.data.id).css("background-color", event.data.secondColor);
    event.data.sound.play();
    playerSequence.push(event.data.id);
    $("#count").html(
      '<button class="play btn btn-secondary">Count: ' + count + "</button>"
    );
    $.doTimeout(800, function() {
      $("#" + event.data.id).css("background-color", event.data.firstColor);
    });
    if (playerSequence.length === pcSequence.length) {
      if (checkSeq(playerSequence, pcSequence) === true) {
        count++;
        $.doTimeout(2000, function() {
          game();
        });
      } else if (
        checkSeq(playerSequence, pcSequence) === false &&
        checked == false
      ) {
        $.doTimeout(2000, function() {
          retry();
          $("#errorMessage").remove();
        });
        $(".maingame").append(
          "<h3 class='text-center' id='errorMessage'>Error! Try again or reset.."
        );
        playerSequence = [];
      } else if (
        checkSeq(playerSequence, pcSequence) === false &&
        checked == true
      ) {
        $(".maingame").append(
          "<h3 class='text-center' id='errorMessage'>Error! Restarting game in a few seconds. Disable Strict Mode for a more forgiving game!"
        );
        $.doTimeout(5000, function() {
          playerSequence = [];
          playing = 0;
          pcSequence = [];
          count = 0;
          $("#count").html(
            '<button class="play btn btn-secondary">Count: ' +
              count +
              "</button>"
          );
          $("#errorMessage").remove();
          game();
        });
      }
    }
  } else if (count >= 21) {
    $(".maingame").append(
      "<h3 class='text-center' id='errorMessage'>You won! Restarting the game in a few seconds."
    );
    $.doTimeout(5000, function() {
      playerSequence = [];
      playing = 0;
      pcSequence = [];
      count = 0;
      $("#count").html(
        '<button class="play btn btn-secondary">Count: ' + count + "</button>"
      );
      $("#errorMessage").remove();
      game();
    });
  }
}

function checkSeq(seq1, seq2) {
  return JSON.stringify(seq1) == JSON.stringify(seq2);
}

$(document).ready(function() {
  $("#about").tooltip();
  $("#reset").on("click", () => {
    playerSequence = [];
    pcSequence = [];
    count = 0;
    $("#count").html(
      '<button class="play btn btn-secondary">Count: ' + count + "</button>"
    );
    $("#errorMessage").remove();
  });
  $("#start").on("click", game);
  $("#red").on(
    "mousedown",
    {
      id: "red",
      firstColor: "#ff0000",
      secondColor: "#ff6d6d",
      sound: soundOne
    },
    changeColor
  );

  $("#blue").on(
    "mousedown",
    {
      id: "blue",
      firstColor: "#0004ff",
      secondColor: "#6365ff",
      sound: soundTwo
    },
    changeColor
  );

  $("#green").on(
    "mousedown",
    {
      id: "green",
      firstColor: "#10a500",
      secondColor: "#52ff3f",
      sound: soundThree
    },
    changeColor
  );

  $("#yellow").on(
    "mousedown",
    {
      id: "yellow",
      firstColor: "#ada900",
      secondColor: "#fffc68",
      sound: soundFour
    },
    changeColor
  );
});
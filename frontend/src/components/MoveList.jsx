function MoveList({
  moves,
  selectedMove,
  onMoveSelect
}) {

  return (
    <div className="move-list">

      <div className="move-list-header">
        <h2>Moves</h2>
        <span className="move-count-chip">{moves.length} moves</span>
      </div>

      <div className="moves">

        {moves.map((move, index) => (

          <button
            key={index}
            className={
              selectedMove === index
                ? "move selected"
                : "move"
            }
            onClick={() =>
              onMoveSelect(index)
            }
          >

            <span>
              {move.move_number}
              {move.color === "Black"
                ? "..."
                : "."}
            </span>

            <strong>
              {move.played}
            </strong>

            <small
              className={
                move.classification.toLowerCase()
              }
            >
              {move.classification}
            </small>

          </button>

        ))}

      </div>

    </div>
  );
}

export default MoveList;
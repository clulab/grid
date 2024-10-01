import { api } from "api";

import { useDrag } from "react-dnd";

export function Sentence({ sentence, onChange, activateSentenceIndex, isActive }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'sentence',
    item: { sentence },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  const color = sentence.color

  return (
    <li 
      className="li-corpus"
      ref={dragRef}
      onDrag={(event) => { 
        activateSentenceIndex(-1);
        onChange(null, null, null);
      }}
      style={{ border: isActive ? '2px solid #BE1C06' : '2px solid #eee' }}
      onClick={(event) => {
        const reselection = isActive;
        const unclick = event.ctrlKey || event.altKey;

        if (unclick && reselection)
          api.clickSentence(sentence.index)
            .then(([preContext, text, postContext]) => {
              activateSentenceIndex(-1);
              onChange(null, null, null);
            });
        else if (!unclick && !reselection)
          api.clickSentence(sentence.index)
            .then(([preContext, text, postContext]) => {
                activateSentenceIndex(sentence.index);
                onChange(preContext, text, postContext);
            });
      }}
      onDoubleClick={(event) => {
        const reselection = isActive;
        const unclick = event.ctrlKey || event.altKey;

        if (!unclick && reselection)
          api.clickSentence(sentence.index);
      }}
    >
      <span
        style={{
          color: color,
          fontWeight: "bold"
        }}
      >
        {(sentence.index + 1).toString()}.
      </span> {sentence.text} {isDragging}
    </li>
  );
}

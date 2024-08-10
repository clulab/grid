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

  return (
    <li 
      className="li-corpus"
      ref={dragRef}
      onDrag={(event) => { activateSentenceIndex(-1) }}
      style={{ border: isActive ? '2px solid #BE1C06' : '2px solid #eee' }}
      onClick={(event) => {
        api.clickSentence(sentence.index)
          .then(([text]) => { // TODO: what does this return?
            if (isActive) {
              activateSentenceIndex(-1);
              onChange([]);
            }
            else {
              activateSentenceIndex(sentence.index);
              onChange(text);
            }
          });
      }}
    >
      <b>{(sentence.index + 1).toString()}.</b> {sentence.text} {isDragging}
    </li>
  );
}

import { api } from "api";

import { useDrag } from "react-dnd";

export function Sentence({ sentence, onChange, activateSentence, isActive }) {
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
      onDrag={(event) => { activateSentence() }}
      style={{ border: isActive ? '2px solid #BE1C06' : '2px solid #eee' }}
      onClick={(event) => {
        api.clickSentence(sentence.index)
          .then(([text]) => { // TODO: what does this return?
            if (isActive) {
              activateSentence();
              onChange([]);
            }
            else {
              activateSentence(text);
              onChange(text);
            }
          });
      }}
    >
      <b>{sentence.index}.</b> {sentence.text} {isDragging}
    </li>
  );
}

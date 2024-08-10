import { api } from "api";

import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";

function Sentence({ sentence, onChange, activateSentence, isActive }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'sentence',
    item: { sentence },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
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

export function Corpus({ sentences, onChange }) {
  const [activeSentence, setActiveSentence] = useState();
  const activateSentence = (item) => setActiveSentence(item);
  const items = sentences && sentences.length > 0 && sentences.map((sentence) =>
    <Sentence
      key={"sentence-" + sentence.index.toString()}
      sentence={sentence}
      onChange={onChange} 
      activateSentence={activateSentence} 
      isActive={activeSentence === sentence} 
    />
  )

  useEffect(() => {
    setActiveSentence();
  }, [sentences])

  return (
    <ul style={{
      padding: 0
    }}>
      {items}
    </ul>
  )
}

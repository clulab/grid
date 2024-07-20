import { useDrag } from "react-dnd";
import { useEffect, useState } from "react";
import { api } from "api";

function Sentence({ text, onChange, activateSentence, isActive }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'sentence',
    item: { text },
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
        api.getSentenceClick(text)
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
      {text} {isDragging}
    </li>
  );
}

export default function Corpus({ sentences, onChange }) {

  const [activeSentence, setActiveSentence] = useState();
  const activateSentence = (item) => setActiveSentence(item);

  let items = sentences && sentences.length > 0 && sentences.map((s, ix) => <Sentence key={ix} text={s} onChange={onChange} activateSentence={activateSentence} isActive={activeSentence === s} />)

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
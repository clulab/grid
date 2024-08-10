import { Sentence } from "./Sentence";

import { useEffect, useState } from "react";

export function Corpus({ sentences, onChange }) {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState();
  const activateSentence = (sentence) => setActiveSentenceIndex(sentence.index);
  const items = sentences && sentences.length > 0 && sentences.map((sentence) =>
    <Sentence
      key={"sentence-" + sentence.index.toString()}
      sentence={sentence}
      onChange={onChange} 
      activateSentence={activateSentence} 
      isActive={activeSentenceIndex === sentence.index} 
    />
  )

  useEffect(() => {
    setActiveSentenceIndex();
  }, [sentences])

  return (
    <ul style={{
      padding: 0
    }}>
      {items}
    </ul>
  )
}

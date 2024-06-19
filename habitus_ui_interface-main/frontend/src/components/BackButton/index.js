

import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import './styles.css';

function BackButton(props) {
  return (
    <>
      <div className="align-horizontal">
        {props.screenName}
      </div>
    </>
  );
}

export default BackButton;

import React from 'react';
import PropTypes from 'prop-types';
import isString from 'lodash.isstring';
import get from 'lodash.get';

import './style.scss';

function renderText(key, name, parent) {
  const replacedValue = get(parent, `meta.incidentContainer.${key}`);
  return replacedValue.split('\n\n').map((item, k) => (
    <div
      key={`${name}-${k + 1}`}
      className="plain-text__box-p"
    >{item}
    </div>));
}

const HandlingMessage = ({ meta, parent }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
      <div className={`${meta.className || 'col-12'} mode_input`}>
        <div className={`${meta.type} plain-text__box`}>
          <div className="label">{meta.label}</div>
          {meta.key && isString(meta.key) ?
            renderText(meta.key, meta.name, parent)
            : ''
          }
        </div>
      </div>
       : ''}
  </div>
);

HandlingMessage.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default HandlingMessage;

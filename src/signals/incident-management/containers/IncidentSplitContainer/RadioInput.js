import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { RadioGroup, Radio, Label } from '@datapunt/asc-ui';
import InfoText from 'components/InfoText';
import { StyledLabel, StyledWrapper } from './styled';

const getInfo = (options, value) => options.find(({ key: currentValue }) => currentValue === value);

const RadioInput = ({ id, name, display, options, initialValue, register }) => {
  const [selected, setSelected] = useState(getInfo(options, initialValue));

  const onChange = useCallback(
    event => {
      event.preventDefault();
      setSelected(getInfo(options, event.target.value));
    },
    [options]
  );

  return (
    <StyledWrapper data-testid={`radioInput-${id}`}>
      <div className="mode_input text rij_verplicht">
        <Label htmlFor={name} label={<strong>{display}</strong>} />

        <RadioGroup name={name}>
          {options.map(({ key, value }) => (
            <StyledLabel key={key} label={value}>
              <Radio
                checked={key === initialValue}
                id={`${id}-${key}`}
                data-testid={`${id}-${key}`}
                value={key}
                ref={register}
                onChange={onChange}
              />
            </StyledLabel>
          ))}
        </RadioGroup>

        {selected?.info && <InfoText text={`${selected.value}: ${selected.info}`} />}
      </div>
    </StyledWrapper>
  );
};

RadioInput.propTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,
  initialValue: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      info: PropTypes.string,
    })
  ),
  register: PropTypes.func,
};

export default RadioInput;

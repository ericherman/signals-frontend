import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, themeSpacing } from '@datapunt/asc-ui';

const FilterGroup = styled.div`
  position: relative;

  & + & {
    margin-top: 30px;
  }
`;

const Toggle = styled.label`
  display: inline-block;
  color: rgb(0, 70, 153);
  margin-left: ${({ indent }) => indent && 2}0px;
  cursor: pointer;
  text-decoration: underline;
  font-size: 16px;
  line-height: 20px;

  &:hover {
    color: rgb(236, 0, 0);
  }

  &:focus {
    background-color: rgb(254, 200, 19);
  }

  & + input[type='checkbox'] {
    visibility: hidden;
    margin-left: -99999em;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  padding-left: 0;
  padding-right: ${themeSpacing(2)};
`;

const setsAreEqual = (a, b) =>
  a.size === b.size && [...a].every(value => b.has(value));

const CheckboxList = ({
  className,
  defaultValue,
  groupId,
  groupName,
  groupValue,
  hasToggle,
  name,
  options,
  title,
  toggleAllLabel,
  toggleNothingLabel,
}) => {
  /**
   * Tracking of boxes that have been checked
   *
   * @param {Array} state
   * @param {Object[]} checked - List of options that correspond to checked boxes
   * @param {Function} setChecked - Handler that receives the full list of checked boxes
   */
  const [checked, setChecked] = useState(new Set(defaultValue));

  /**
   * Toggle selection indicator
   *
   * @param {Array} state
   * @param {Boolean} toggled - Indicates if the toggle has been clicked/activated
   * @param {Function} setToggled - Handler that receives a boolean
   */
  const [toggled, setToggled] = useState(false);
  const numOptions = useMemo(() => options.length, [options]);

  /**
   * Verify if an option has been marked as checked
   *
   * @param {String} id - key to check for
   * @returns {Boolean}
   */
  const isChecked = useCallback(
    id => {
      if (id === undefined) return false;

      for (const option of checked) {
        if (option.id === id || option.key === id) {
          return true;
        }
      }

      return false;
    },
    [checked]
  );

  /**
   * Get one of the checked options
   *
   * @param {String} id - key to check for
   * @returns {Object}
   */
  const getChecked = useCallback(
    id => {
      let foundOption;

      for (const option of checked) {
        if (option.id === id || option.key === id) {
          foundOption = option;
        }
      }

      return foundOption;
    },
    [checked]
  );

  /**
   * Get an entry from the `option` prop value
   *
   * @param {String} id - key to check for
   * @returns {(Object|undefined)}
   */
  const getOption = useCallback(
    id => options.find(option => option.id === id || option.key === id),
    [options]
  );

  useEffect(() => {
    const wholeGroupChecked = isChecked(groupId) || checked.size === numOptions;

    setToggled(wholeGroupChecked);

    if (!wholeGroupChecked) return;

    const optionsSet = new Set(options);

    if (!setsAreEqual(optionsSet, checked)) {
      setChecked(optionsSet);
    }
    // no need for dependencies; only execute on mount
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const state = new Set(defaultValue);

    if (setsAreEqual(state, checked)) return;

    setChecked(state);

    setToggled(state.size === numOptions);
    // don't need all dependencies; only execute when value of `defaultValue` prop changes
    // eslint-disable-next-line
  }, [defaultValue]);

  /**
   * Removes option from or adds option to state
   */
  const handleIndividualCheck = useCallback(
    ({ target }) => {
      const { checked: targetIsChecked } = target;

      setChecked(state => {
        const modifiedState = new Set(state);

        if (targetIsChecked) {
          modifiedState.add(getOption(target.dataset.id));
        } else {
          const option = getChecked(target.dataset.id);

          modifiedState.delete(option);
        }

        const allOptionsChecked = modifiedState.size === numOptions;

        setToggled(allOptionsChecked);

        return modifiedState;
      });
    },
    [getChecked, getOption, numOptions]
  );

  /**
   * Checks or unchecks all options in state
   */
  const handleToggle = useCallback(() => {
    setChecked(new Set(toggled ? [] : options));
    setToggled(!toggled);
  }, [options, toggled]);

  return (
    <FilterGroup className={className}>
      {title && title}

      {hasToggle && (
        <Toggle
          indent={Boolean(title)}
          tabIndex={0}
          onClick={groupName ? null : handleToggle}
        >
          {toggled ? toggleNothingLabel : toggleAllLabel}

          {groupName && (
            <input
              checked={toggled}
              name={groupName}
              onChange={handleToggle}
              type="checkbox"
              value={groupValue || name}
            />
          )}
        </Toggle>
      )}

      {options.map(({ id, key, slug, value: label }) => {
        const uid = id || key;
        const optionId = [name, uid].filter(Boolean).join('_');
        const value = slug || key;

        if (!uid) {
          return null;
        }

        return (
          <div key={optionId}>
            <StyledCheckbox
              checked={isChecked(groupId) || isChecked(uid)}
              data-id={uid}
              id={optionId}
              name={name}
              onChange={handleIndividualCheck}
              type="checkbox"
              value={value}
            />
            <label htmlFor={optionId}>{label}</label>
          </div>
        );
      })}
    </FilterGroup>
  );
};

CheckboxList.defaultProps = {
  className: '',
  defaultValue: [],
  groupId: undefined,
  groupName: '',
  groupValue: '',
  hasToggle: false,
  title: null,
  toggleAllLabel: 'Alles selecteren',
  toggleNothingLabel: 'Niets selecteren',
};

CheckboxList.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** List of keys for elements that need to be checked by default */
  defaultValue: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    })
  ),
  /**
   * Unique group identifier. Is used to match against the values of the `prop` attribute in the `options` prop.
   * If a match is found, the entire group is checked. Do note that, despite the name, this prop is not used as
   * the `id` attribute for any of the checkboxes.
   */
  groupId: PropTypes.string,
  /** Name of the toggle field as it should appear in the form data */
  groupName: PropTypes.string,
  /** Value for the toggle field as it should appear in the form data */
  groupValue: PropTypes.string,
  /** When true, will show a toggle element */
  hasToggle: PropTypes.bool,
  /** Value of the `name` attribute of the checkboxes */
  name: PropTypes.string.isRequired,
  /**
   * Values to be rendered as checkbox elements
   * Note that either one of `id` or `key` values should be present in an options entry
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string,
      slug: PropTypes.string,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Group label contents */
  title: PropTypes.node,
  /** Text label for the group toggle in its untoggled state */
  toggleAllLabel: PropTypes.string,
  /** Text label for the group toggle in its toggled state */
  toggleNothingLabel: PropTypes.string,
};

export default CheckboxList;

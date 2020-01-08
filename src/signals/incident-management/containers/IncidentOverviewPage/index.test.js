import React from 'react';
import { mount } from 'enzyme';
import { fireEvent, render, act } from '@testing-library/react';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import incidentJson from 'utils/__tests__/fixtures/incident.json';

import { withAppContext } from 'test/utils';
import {
  priorityList,
  statusList,
  stadsdeelList,
  feedbackList,
} from 'signals/incident-management/definitions';
import * as constants from 'signals/incident-management/constants';

import IncidentOverviewPage, {
  IncidentOverviewPageContainerComponent,
} from '.';

jest.mock('scroll-lock');
jest.mock('signals/incident-management/constants');
jest.mock('signals/incident-management/actions', () => {
  const actual = jest.requireActual('signals/incident-management/actions');
  const {
    PAGE_CHANGED,
    // eslint-disable-next-line
  } = require('signals/incident-management/constants');

  return {
    __esModule: true,
    ...actual,
    pageChanged: jest.fn(page => ({
      type: PAGE_CHANGED,
      payload: page,
    })),
  };
});

// make sure that JSDOM doesn't trip over unsupported feature
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});

const generateIncidents = (number = 100) =>
  [...new Array(number).keys()].map(index => ({
    ...incidentJson,
    id: index + 1,
  }));

describe('signals/incident-management/containers/IncidentOverviewPage', () => {
  let props;

  beforeEach(() => {
    constants.FILTER_PAGE_SIZE = 50;

    props = {
      incidents: {
        count: 0,
        results: [],
        loading: true,
      },
      page: 3,
      categories: {},
      orderingChangedAction: jest.fn(),
      pageChangedAction: jest.fn(),
      dataLists: {
        priority: priorityList,
        status: statusList,
        stadsdeel: stadsdeelList,
        feedback: feedbackList,
      },
    };
  });

  it('should render modal buttons', () => {
    const { getByText } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    );

    expect(getByText('Filteren').tagName).toEqual('BUTTON');
    expect(getByText('Mijn filters').tagName).toEqual('BUTTON');
  });

  it('should render a list of incidents', () => {
    const { queryByTestId, rerender } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    );

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
    expect(
      queryByTestId('incidentOverviewListComponent')
    ).not.toBeInTheDocument();

    const incidents = generateIncidents();

    rerender(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
    expect(queryByTestId('incidentOverviewListComponent')).toBeInTheDocument();
  });

  it('should render pagination controls', () => {
    constants.FILTER_PAGE_SIZE = 101;
    const incidents = generateIncidents();

    const { queryByTestId, rerender } = render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(queryByTestId('pagination')).not.toBeInTheDocument();

    constants.FILTER_PAGE_SIZE = 99;

    rerender(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(queryByTestId('pagination')).toBeInTheDocument();
  });

  it('should show notification when no results can be rendered', () => {
    const { getByText } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    );

    expect(getByText('Geen meldingen')).toBeInTheDocument();
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.activeFilter).not.toBeUndefined();
    expect(containerProps.dataLists).not.toBeUndefined();
    expect(containerProps.ordering).not.toBeUndefined();
    expect(containerProps.page).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.pageChangedAction).not.toBeUndefined();
    expect(typeof containerProps.pageChangedAction).toEqual('function');

    expect(containerProps.orderingChangedAction).not.toBeUndefined();
    expect(typeof containerProps.orderingChangedAction).toEqual('function');
  });

  it('should set page after navigating with pagination', () => {
    constants.FILTER_PAGE_SIZE = 30;

    const incidents = generateIncidents();

    const { getByTestId } = render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(props.pageChangedAction).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(
        getByTestId('pagination').querySelector('button:first-of-type')
      );
    });

    expect(props.pageChangedAction).toHaveBeenCalledWith(expect.any(Number));
  });

  describe('filter modal', () => {
    it('opens filter modal', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />)
      );

      expect(queryByTestId('filterModal')).toBeNull();

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', { bubbles: true })
      );

      expect(queryByTestId('filterModal')).not.toBeNull();
    });

    it('opens my filters modal', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />)
      );

      expect(queryByTestId('myFiltersModal')).toBeNull();

      fireEvent(
        getByTestId('myFiltersModalBtn'),
        new MouseEvent('click', { bubbles: true })
      );

      expect(queryByTestId('myFiltersModal')).not.toBeNull();
    });

    it('closes modal on ESC', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />)
      );

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(queryByTestId('filterModal')).not.toBeNull();

      fireEvent.keyDown(global.document, { key: 'Esc', keyCode: 27 });

      expect(queryByTestId('filterModal')).toBeNull();
    });

    it('closes modal by means of close button', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />)
      );

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(queryByTestId('filterModal')).not.toBeNull();

      fireEvent(
        getByTestId('closeBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(queryByTestId('filterModal')).toBeNull();
    });

    it('should disable page scroll', () => {
      const { getByTestId } = render(withAppContext(<IncidentOverviewPage />));

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(disablePageScroll).toHaveBeenCalled();
    });

    it('should enable page scroll', () => {
      const { getByTestId } = render(withAppContext(<IncidentOverviewPage />));

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      fireEvent(
        getByTestId('closeBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(enablePageScroll).toHaveBeenCalled();
    });
  });
});

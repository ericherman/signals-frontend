// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
// eslint-disable-next-line no-restricted-imports
import React from 'react'

import { renderHook } from '@testing-library/react-hooks'
import * as reactRedux from 'react-redux'

import useFetchAll from 'hooks/useFetchAll'
import departmentsFixture from 'utils/__tests__/fixtures/departments.json'

import { useDepartments } from './useDepartments'

const departments = departmentsFixture.results

jest.mock('hooks/useFetchAll')

const fetchResponseMock = [
  {
    code: 'CCA',
    name: 'CCA',
    categories: [
      {
        is_responsible: true,
        category: {
          name: 'A',
        },
      },
      {
        is_responsible: false,
        category: {
          name: 'B',
        },
      },
    ],
  },
]

describe('useDepartments', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue({ list: departments })
    jest.spyOn(React, 'useContext').mockReturnValue({
      departmentsWithResponsibleCategories: {
        departments,
      },
    })
  })

  it('should return departments', () => {
    jest.mocked(useFetchAll as any).mockImplementation(() => ({
      data: fetchResponseMock,
      isLoading: false,
      get: jest.fn(),
    }))

    const { result } = renderHook(useDepartments)

    expect(result.current).toEqual({
      departments: [
        {
          value: 'CCA',
          display: 'CCA',
          category_names: ['A'],
        },
      ],
      isLoading: false,
    })
  })

  it('should return undefined departments when data from useFetchAll is undefined', () => {
    jest.mocked(useFetchAll as any).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      get: jest.fn(),
    }))

    const { result } = renderHook(useDepartments)

    expect(result.current).toEqual({
      departments: undefined,
      isLoading: false,
    })
  })

  it('should return undefined departments when departments from redux are empty', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(undefined)

    jest.mocked(useFetchAll as any).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      get: jest.fn(),
    }))

    const { result } = renderHook(useDepartments)

    expect(result.current).toEqual({
      departments: undefined,
      isLoading: false,
    })
  })
})

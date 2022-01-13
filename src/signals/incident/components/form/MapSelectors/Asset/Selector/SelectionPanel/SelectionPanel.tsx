// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useState, useContext, useEffect } from 'react'
import styled from 'styled-components'

import type { KeyboardEvent, ChangeEvent, FC } from 'react'
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext'

import { MapPanelContent } from '@amsterdam/arm-core'
import {
  Paragraph,
  Button,
  themeSpacing,
  Label,
  Input,
  Checkbox,
  themeColor,
} from '@amsterdam/asc-ui'

import AssetList from '../../AssetList'

import type { FeatureType } from '../../types'
import { UNREGISTERED_TYPE } from '../../../constants'
import AssetSelectContext from '../../../Asset/context'

const StyledAssetList = styled(AssetList)`
  margin: ${themeSpacing(2)} 0 ${themeSpacing(4)} 0;
`

const StyledButton = styled(Button)`
  margin-top: ${themeSpacing(6)};
`

const StyledParagraph = styled(Paragraph)`
  margin-top: ${themeSpacing(6)};
`

const StyledMapPanelContent = styled(MapPanelContent)`
  background: none;
`

const Description = styled.span`
  display: block;
  font-weight: 400;
  font-size: 16px;
  color: ${themeColor('tint', 'level5')};
`

export interface SelectionPanelProps {
  featureTypes: FeatureType[]
  language?: Record<string, string>
  variant: Variant
}

const SelectionPanel: FC<SelectionPanelProps> = ({
  variant,
  featureTypes,
  language = {},
}) => {
  const { selection, removeItem, setItem, close } =
    useContext(AssetSelectContext)

  const selectionOnMap =
    selection && selection.type !== UNREGISTERED_TYPE ? selection : undefined

  const unregisteredAsset =
    selection && selection.type === UNREGISTERED_TYPE ? selection : undefined

  const [showObjectIdInput, setShowObjectIdInput] = useState(
    unregisteredAsset !== undefined
  )
  const [unregisteredAssetValue, setUnregisteredAssetValue] = useState(
    unregisteredAsset?.id || ''
  )

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUnregisteredAssetValue(event.currentTarget.value)
  }

  const onCheck = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setShowObjectIdInput(!showObjectIdInput)

      if (!event.target.checked) {
        removeItem()
      }
    },
    [removeItem, showObjectIdInput]
  )

  const onSetItem = useCallback(() => {
    setItem({
      location: {},
      id: unregisteredAssetValue,
      type: UNREGISTERED_TYPE,
    })
  }, [setItem, unregisteredAssetValue])

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSetItem()
        close()
      }
    },
    [close, onSetItem]
  )

  useEffect(() => {
    if (selectionOnMap) {
      setUnregisteredAssetValue('')
      setShowObjectIdInput(false)
    }

    if (unregisteredAsset) {
      setShowObjectIdInput(true)
    }
  }, [selectionOnMap, unregisteredAsset])

  return (
    <StyledMapPanelContent
      variant={variant}
      title={language.title || 'Locatie'}
      data-testid="selectionPanel"
    >
      <Paragraph strong>
        {language.subTitle || 'U kunt maar een object kiezen'}
        {language.description ? (
          <Description>{language.description}</Description>
        ) : null}
      </Paragraph>

      {selection && selectionOnMap && (
        <StyledAssetList
          selection={selection}
          onRemove={removeItem}
          featureTypes={featureTypes}
        />
      )}

      {featureTypes.length > 0 && (!selection || unregisteredAsset) && (
        <div data-testid="unregisteredObjectPanel">
          <Checkbox
            id="unregisteredAssetCheckbox"
            checked={showObjectIdInput}
            onChange={onCheck}
          />
          <Label
            htmlFor="unregisteredAssetCheckbox"
            label={language.unregistered || 'Het object staat niet op de kaart'}
          />

          {showObjectIdInput && language.unregisteredId && (
            <>
              <StyledParagraph>
                Typ het dichtstbijzijnde adres of klik de locatie aan op de
                kaart.
              </StyledParagraph>
              <Label
                htmlFor="unregisteredAssetInput"
                label={
                  <>
                    <strong>{language.unregisteredId}</strong> (niet verplicht)
                  </>
                }
              />
              <Input
                id="unregisteredAssetInput"
                onBlur={onSetItem}
                onChange={onChange}
                onKeyUp={onKeyUp}
                onSubmit={close}
                value={unregisteredAssetValue}
              />
            </>
          )}
        </div>
      )}

      <StyledButton onClick={close} variant="primary">
        {language.submit || 'Meld dit object'}
      </StyledButton>
    </StyledMapPanelContent>
  )
}

export default SelectionPanel

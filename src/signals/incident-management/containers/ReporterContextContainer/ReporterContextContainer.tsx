// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import { useParams } from 'react-router-dom';

const ReporterContextContainer: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();

  return <div data-testid="reporterContextContainer">hello world - incident {id}</div>;
};

export default ReporterContextContainer;

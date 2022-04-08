import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
} from '@mui/material';
import { ViewSDKClient } from './ViewSDKClient';

interface IAdobeViewProp {
  showAnnotationTools: boolean,
  showLeftHandPanel: boolean,
  showPageControls: boolean,
  showDownloadPDF: boolean,
  showPrintPDF: boolean,
  dockPageControls: boolean,
  enableFormFilling: boolean,
  defaultViewMode: string,
}

const defaultViewProp: IAdobeViewProp = {
  showAnnotationTools: false,
  showLeftHandPanel: false,
  showPageControls: true,
  showDownloadPDF: true,
  showPrintPDF: true,
  dockPageControls: true,
  enableFormFilling: false,
  defaultViewMode: "FIT_WIDTH",
}
interface RenderPDFProps {
  blob: Blob,
  filename: string,
  viewProps?: IAdobeViewProp,
}

export const RenderPDF = (props: RenderPDFProps) => {
  const { blob, filename, viewProps } = props;
  useEffect(() => {
    if (blob && filename) {
      const viewSDKClient = new ViewSDKClient();
      viewSDKClient.ready().then(() => {
        viewSDKClient.previewFile("pdf-div", {
          ...defaultViewProp,
          ...viewProps
        }, blob, filename);
      });
    }
  }, [blob, filename, viewProps]);
  
  return (
    <Grid
      container
      sx={{
        height: '100%',
      }}
    >
      <div id="pdf-div"/>
    </Grid>
  );
}

RenderPDF.propTypes = {
  blob: PropTypes.instanceOf(Blob),
  filename: PropTypes.string,
};
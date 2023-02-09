import React, { useEffect, useState } from 'react';
import './appDetails.scss';
import { useParams } from 'react-router';
import { AppStreamData, AppType, DeploymentAppType } from './appDetails.type';
import IndexStore from './index.store';
import EnvironmentStatusComponent from './sourceInfo/environmentStatus/EnvironmentStatus.component';
import EnvironmentSelectorComponent from './sourceInfo/EnvironmentSelector.component';
import SyncErrorComponent from './SyncError.component';
import { useEventSource } from '../../common';
import { AppLevelExternalLinks } from '../../externalLinks/ExternalLinks.component';
import NodeTreeDetailTab from './NodeTreeDetailTab';
import { ExternalLink, OptionTypeWithIcon } from '../../externalLinks/ExternalLinks.type';
import { getSaveTelemetry } from './appDetails.api';


const AppDetailsComponent = ({
    externalLinks,
    monitoringTools,
    isExternalApp
}: {
    externalLinks: ExternalLink[]
    monitoringTools: OptionTypeWithIcon[]
    isExternalApp: boolean
}) => {
    const params = useParams<{ appId: string; envId: string; nodeType: string }>();
    const [streamData, setStreamData] = useState<AppStreamData>(null);
    const appDetails = IndexStore.getAppDetails();
    const Host = process.env.REACT_APP_ORCHESTRATOR_ROOT;
    const isDeploymentAppDeleteRequest = appDetails.deploymentAppType === DeploymentAppType.argo_cd && (appDetails.deploymentAppDeleteRequest || true)

    useEffect(() => {
     if( appDetails?.appType === AppType.EXTERNAL_HELM_CHART && params.appId){
      getSaveTelemetry(params.appId)
     }
    },[])

    // if app type not of EA, then call stream API
    const syncSSE = useEventSource(
        `${Host}/api/v1/applications/stream?name=${appDetails?.appName}-${appDetails?.environmentName}`,
        [params.appId, params.envId],
        !!appDetails?.appName &&
            !!appDetails?.environmentName &&
            appDetails?.appType?.toString() != AppType.EXTERNAL_HELM_CHART.toString(),
        (event) => setStreamData(JSON.parse(event.data)),
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div>
                <EnvironmentSelectorComponent isExternalApp={isExternalApp} />
             {!isDeploymentAppDeleteRequest &&  <EnvironmentStatusComponent appStreamData={streamData}/> }
            </div>

            <SyncErrorComponent appStreamData={streamData}/>
            <AppLevelExternalLinks helmAppDetails={appDetails} externalLinks={externalLinks} monitoringTools={monitoringTools} />
            <NodeTreeDetailTab appDetails={appDetails} externalLinks={externalLinks} monitoringTools={monitoringTools} />
        </div>
    );
};

export default AppDetailsComponent;

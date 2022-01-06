import React, { Suspense, useEffect, useState } from 'react';
import { useRouteMatch, useParams, Redirect } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { URLS } from '../../config';
import { DetailsProgressing } from '../common';
import './lib/bootstrap-grid.min.css';
import ValuesComponent from './values/ChartValues.component';
import AppHeaderComponent from './headers/AppHeader.component';
import ChartHeaderComponent from './headers/ChartHeader.component';
import { getInstalledAppDetail, getInstalledChartDetail } from './appDetails/appDetails.api';
import AppDetailsComponent from './appDetails/AppDetails.component';
import { EnvType } from './appDetails/appDetails.type';
import IndexStore from './appDetails/index.store';
import ErrorImage from './assets/icons/ic-404-error.png';

let initTimer = null;

function RouterComponent({ envType }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const params = useParams<{ appId: string; envId: string; nodeType: string }>();
    const { path } = useRouteMatch();

    useEffect(() => {
        IndexStore.setEnvDetails(envType, +params.appId, +params.envId);

        setIsLoading(true);

        if (initTimer) {
            clearTimeout(initTimer);
        }

        init();
    }, [params.appId, params.envId]);

    // clearing the timer on component unmount
    useEffect(() => {
        return (): void => {
            if (initTimer) {
                clearTimeout(initTimer);
            }
        };
    }, []);

    const init = async () => {
        try {
            let response = null;

            if (envType === EnvType.CHART) {
                response = await getInstalledChartDetail(+params.appId, +params.envId);
            } else {
                response = await getInstalledAppDetail(+params.appId, +params.envId);
            }

            IndexStore.setAppDetails(response.result);

            setIsLoading(false);

            initTimer = setTimeout(init, 30000);
        } catch (e) {
            console.log('error while fetching InstalledAppDetail', e);
            setIsLoading(false);
            setIsError(true);
        }
    };

    const redirectToHomePage = () => {};

    const PageNotFound = () => {
        return (
            <section className="app-not-configured w-100">
                <img src={ErrorImage} />
                <div className="w-250 flex column">
                    <h4 className="fw-6">This app does not exist</h4>
                    <div className="mb-20 flex align-center">
                    We could not find and connect to this application. 
                    </div>
                    <div className="cta" onClick={redirectToHomePage}>
                        Go back to home page
                    </div>
                </div>
            </section>
        );
    };

    return (
        <React.Fragment>
            {EnvType.APPLICATION === envType ? <AppHeaderComponent /> : <ChartHeaderComponent />}

            
            {/* {isError ? (
                <PageNotFound /> */}
            {/* ) : */}
            { isLoading ? (
                <DetailsProgressing loadingText="Please wait…" size={24} />
            ) : (
                <Suspense fallback={<DetailsProgressing loadingText="Please wait…" size={24} />}>
                    <Switch>
                        <Route path={`${path}/${URLS.APP_DETAILS}`} component={AppDetailsComponent} />
                        <Route path={`${path}/${URLS.APP_VALUES}`} component={ValuesComponent} />
                        <Redirect to={`${path}/${URLS.APP_DETAILS}`} />
                    </Switch>
                </Suspense>
            )}

            
        </React.Fragment>
    );
}

export default RouterComponent;

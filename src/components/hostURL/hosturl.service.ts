import { post, put, get } from '../../services/api';
import { Routes } from '../../config';

export function getHostURLConfigurationList(): Promise<any> {
    const URL = `${Routes.HOST_URL}/active/`;
    return get(URL)
}

export function saveHostURLConfiguration(request): Promise<any> {
    const URL = `${Routes.HOST_URL}/create`;
    return post(URL, request);
}

export function updateHostURLConfiguration(request): Promise<any> {
    const URL = `${Routes.HOST_URL}/update`;
    return put(URL, request);
}
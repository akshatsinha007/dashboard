import React, { useMemo, useRef, useState } from 'react'
import {
    SortingOrder,
    useAsync,
    useUrlFilters,
    abortPreviousRequests,
    getIsRequestAborted,
    SelectAllDialogStatus,
    BulkSelectionProvider,
    BulkSelectionIdentifiersType,
    UserStatus,
} from '@devtron-labs/devtron-fe-common-lib'

import { getUserList } from '../../authorization.service'
import { SortableKeys } from './constants'
import { importComponentFromFELibrary } from '../../../../../components/common'
import { User } from '../../types'
import { getIsAdminOrSystemUser, parseSearchParams } from '../utils'
import UserPermissionContainer from './UserPermissionContainer'
import { BulkSelectionModalConfig, BulkSelectionModalTypes } from '../../shared/components/BulkSelection'
import { UserListFilter } from './types'

const StatusHeaderCell = importComponentFromFELibrary('StatusHeaderCell', null, 'function')

const showStatus = !!StatusHeaderCell

const UserPermissionList = () => {
    const [bulkSelectionModalConfig, setBulkSelectionModalConfig] = useState<BulkSelectionModalConfig>({
        type: null,
    })

    const { status, ..._urlFilters } = useUrlFilters<SortableKeys, UserListFilter>({
        initialSortKey: SortableKeys.email,
        parseSearchParams,
    })

    const updateStatusFilter = (_status: UserStatus[]) => {
        _urlFilters.updateSearchParams({
            status: _status,
        })
    }

    const urlFilters = {
        ..._urlFilters,
        status,
        updateStatusFilter,
    }

    const { pageSize, offset, searchKey, sortBy, sortOrder } = urlFilters
    const filterConfig = useMemo(
        () => ({
            size: pageSize,
            offset,
            searchKey,
            sortBy,
            sortOrder,
            status,
        }),
        [pageSize, offset, searchKey, sortBy, sortOrder, JSON.stringify(status)],
    )

    const abortControllerRef = useRef(new AbortController())
    const [isLoading, result, error, reload] = useAsync(
        () =>
            abortPreviousRequests(
                () => getUserList(filterConfig, abortControllerRef.current.signal),
                abortControllerRef,
            ),
        [filterConfig],
        true,
        {
            resetOnChange: false,
        },
    )
    const allOnThisPageIdentifiers = useMemo(
        () =>
            result?.users.reduce((acc, user) => {
                if (!getIsAdminOrSystemUser(user.emailId)) {
                    acc[user.id] = true
                }
                return acc
            }, {}) ?? {},
        [result],
    )

    const showLoadingState = isLoading || getIsRequestAborted(error)

    const getUserDataForExport = () =>
        getUserList({
            ...filterConfig,
            showAll: true,
            offset: null,
            size: null,
            sortBy: SortableKeys.email,
            sortOrder: SortingOrder.ASC,
        })

    const getSelectAllDialogStatus = () => {
        // Set to show the modal, the function is called only if there is an existing selection,
        // so the modal won't open if there is no selection
        setBulkSelectionModalConfig({
            type: BulkSelectionModalTypes.selectAllAcrossPages,
        })

        return SelectAllDialogStatus.OPEN
    }

    return (
        <BulkSelectionProvider<BulkSelectionIdentifiersType<Record<User['id'], boolean>>>
            identifiers={allOnThisPageIdentifiers}
            getSelectAllDialogStatus={getSelectAllDialogStatus}
        >
            <UserPermissionContainer
                showStatus={showStatus}
                error={error}
                getUserDataForExport={getUserDataForExport}
                showLoadingState={showLoadingState}
                totalCount={result?.totalCount}
                users={result?.users ?? []}
                refetchUserPermissionList={reload}
                urlFilters={urlFilters}
                bulkSelectionModalConfig={bulkSelectionModalConfig}
                setBulkSelectionModalConfig={setBulkSelectionModalConfig}
            />
        </BulkSelectionProvider>
    )
}

export default UserPermissionList

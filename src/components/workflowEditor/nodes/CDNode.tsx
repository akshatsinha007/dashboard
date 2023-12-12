import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Add } from '../../../assets/icons/ic-add.svg'
import { ReactComponent as ICDelete } from '../../../assets/icons/ic-delete-interactive.svg'
import Tippy from '@tippyjs/react'
import { CDNodeProps, CDNodeState } from '../types'
import { toast } from 'react-toastify'
import {
    BUTTON_TEXT,
    CONFIRMATION_DIALOG_MESSAGING,
    ERR_MESSAGE_ARGOCD,
    VIEW_DELETION_STATUS,
} from '../../../config/constantMessaging'
import { ConfirmationDialog } from '@devtron-labs/devtron-fe-common-lib'
import warningIconSrc from '../../../assets/icons/info-filled.svg'
import { URLS } from '../../../config'
import { envDescriptionTippy } from '../../app/details/triggerView/workflow/nodes/workflow.utils'

export class CDNode extends Component<CDNodeProps, CDNodeState> {
    constructor(props) {
        super(props)
        this.state = {
            showDeletePipelinePopup: false,
        }
    }

    onClickShowDeletePipelinePopup = () => {
        this.setState({
            showDeletePipelinePopup: true,
        })
    }

    onClickHideDeletePipelinePopup = () => {
        this.setState({ showDeletePipelinePopup: false })
    }

    handleDeleteCDNode = (e: React.MouseEvent) => {
        e.preventDefault()
        // TODO: Implement deleteCDNode
        console.log('deleteCDNode');
    }

    renderReadOnlyCard() {
        return (
            <div className="workflow-node dc__overflow-scroll">
                <div className="workflow-node__title flex">
                    <div className="workflow-node__full-width-minus-Icon">
                        <span className="workflow-node__text-light">Deploy</span>
                        <div className="flex left column fs-12 fw-6 lh-18 pt-6 pb-6">
                            {this.props.cdNamesList.map((_cdName) => (
                                <span className="dc__ellipsis-right">{_cdName}</span>
                            ))}
                        </div>
                    </div>
                    <div className="workflow-node__icon-common workflow-node__CD-icon"></div>
                </div>
            </div>
        )
    }

    handleAddNewNode = (event: any) => {
        event.preventDefault()
        if (this.props.addNewPipelineBlocked) {
            return
        }
        if (this.props.deploymentAppDeleteRequest) {
            toast.error(ERR_MESSAGE_ARGOCD)
        } else {
            event.stopPropagation()
            let { top, left } = event.target.getBoundingClientRect()
            top = top + 25
            this.props.toggleCDMenu()
        }
    }

    getAppDetailsURL(): string {
        const url = `${URLS.APP_DETAILS}/${this.props.environmentId}`
        return `${this.props.match.url.replace('edit/workflow', url)}`
    }

    renderConfirmationModal = (): JSX.Element => {
        return (
            <ConfirmationDialog>
                <ConfirmationDialog.Icon src={warningIconSrc} />
                <ConfirmationDialog.Body
                    title={`Deployment pipeline for ${this.props.environmentName} environment is being deleted`}
                />
                <p className="fs-13 cn-7 lh-1-54 mt-20">{CONFIRMATION_DIALOG_MESSAGING.DELETION_IN_PROGRESS}</p>
                <ConfirmationDialog.ButtonGroup>
                    <button type="button" className="cta cancel" onClick={this.onClickHideDeletePipelinePopup}>
                        {BUTTON_TEXT.CANCEL}
                    </button>
                    <Link to={this.getAppDetailsURL()}>
                        <button className="cta ml-12 dc__no-decor">{VIEW_DELETION_STATUS}</button>
                    </Link>
                </ConfirmationDialog.ButtonGroup>
            </ConfirmationDialog>
        )
    }

    onClickNodeCard = (event) => {
        if (this.props.deploymentAppDeleteRequest) {
            event.preventDefault()
            this.onClickShowDeletePipelinePopup()
        } else {
            this.props.hideWebhookTippy()
        }
    }

    renderCardContent() {
        return (
            <>
                <Link to={this.props.to} onClick={this.onClickNodeCard} className="dc__no-decor">
                    <div
                        data-testid={`workflow-editor-cd-node-${this.props.environmentName}`}
                        className={`workflow-node cursor ${this.props.deploymentAppDeleteRequest ? 'pl-0' : 'pl-16'}`}
                    >
                        {this.props.deploymentAppDeleteRequest ? (
                            <div className="workflow-node__trigger-type-delete workflow-node__trigger-type--create-delete bcr-5 m-0 dc__position-abs fs-10 dc__uppercase dc__top-radius-8 dc__text-center"></div>
                        ) : (
                            <div className="workflow-node__trigger-type workflow-node__trigger-type--create">
                                {this.props.triggerType}
                            </div>
                        )}
                        <div className="workflow-node__title h-100 workflow-node__title--no-margin flex">
                            <div className="workflow-node__full-width-minus-Icon p-12">
                                <span className="workflow-node__text-light">
                                    {this.props.deploymentAppDeleteRequest ? (
                                        <div className="cr-5">
                                            Deleting
                                            <span className="dc__loading-dots" />
                                        </div>
                                    ) : (
                                        this.props.title
                                    )}
                                </span>
                                {envDescriptionTippy(this.props.environmentName, this.props.description)}
                            </div>

                            {/*TODO: Look into these css later */}
                            <div
                                className={`workflow-node__icon-common pt-12 pb-12 mr-12 ${
                                    this.props.isVirtualEnvironment
                                        ? 'workflow-node__CD-rocket-icon'
                                        : 'workflow-node__CD-icon dc__flip'
                                }`}
                            />

                            <div className="flexbox-col h-100 dc__border-left-n1 w-24 dc__align-items-center">
                                <Tippy
                                    placement="right"
                                    className="default-tt"
                                    content={
                                        <span className="add-cd-btn-tippy">
                                            {this.props.addNewPipelineBlocked
                                                ? 'Cannot add new workflow or deployment pipelines when environment filter is applied.'
                                                : 'Add deployment pipeline'}
                                        </span>
                                    }
                                >
                                    <div className="flex h-100 w-100 dc__border-bottom-n1--important">
                                        <button
                                            type="button"
                                            className="flex h-100 w-100 p-0 dc__outline-none-imp bcn-0 dc__no-border workflow-node__title--add-cd-icon dc__hover-b500  pt-4 pb-4 pl-6 pr-6 workflow-node__title--top-right-rad-8"
                                            disabled={this.props.addNewPipelineBlocked}
                                            onClick={this.handleAddNewNode}
                                        >
                                            <Add className="icon-dim-12" />
                                        </button>
                                    </div>
                                </Tippy>

                                <Tippy placement="right" content="Delete pipeline" className="default-tt">
                                    <button
                                        type="button"
                                        className="flex h-100 w-100 dc__hover-b500 workflow-node__title--bottom-right-rad-8 pt-4 pb-4 pl-6 pr-6 dc__outline-none-imp bcn-0 dc__no-border workflow-node__title--delete-cd-icon"
                                        onClick={this.handleDeleteCDNode}
                                    >
                                        <ICDelete className="icon-dim-12" />
                                    </button>
                                </Tippy>
                            </div>
                        </div>
                    </div>
                </Link>
                {this.state.showDeletePipelinePopup && this.renderConfirmationModal()}
            </>
        )
    }

    render() {
        return (
            <foreignObject
                className="data-hj-whitelist"
                key={`cd-${this.props.id}`}
                x={this.props.x}
                y={this.props.y}
                width={this.props.width}
                height={this.props.height}
                style={{ overflow: this.props.cdNamesList?.length > 0 ? 'scroll' : 'visible' }}
            >
                {this.props.cdNamesList?.length > 0 ? this.renderReadOnlyCard() : this.renderCardContent()}
            </foreignObject>
        )
    }
}

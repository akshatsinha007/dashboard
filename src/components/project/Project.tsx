import React, { Component } from 'react';
import { ButtonWithLoader, showError } from '../../components/common';
import { ReactComponent as Error } from '../../assets/icons/ic-warning.svg'
import folder from '../../assets/icons/ic-folder.svg';
import { ReactComponent as Trash } from '../../assets/icons/ic-delete.svg';
import DeleteComponent from '../../util/DeleteComponent';
import { deleteProject } from './service';
import './project.css'
import { DeleteComponentsName, DC_PROJECT_CONFIRMATION_MESSAGE } from '../../config/constantMessaging';
import { ProjectType } from './types';

export interface ProjectProps {
    id: number;
    name: string;
    projects: ReadonlyArray<ProjectType>
    active: boolean;
    isCollapsed: boolean;
    saveProject: (index) => void;
    onCancel: (index) => void;
    handleChange: (Event, index: number, key: 'name') => void;
    loadingData: boolean;
    index: number;
    isValid: { name: boolean };
    errorMessage: { name: string };
    reload: () => void
}

export interface ProjectState {
    deleting: boolean;
    confirmation: boolean;
    validationError: string;
}
export class Project extends Component<ProjectProps, ProjectState>  {

    constructor(props) {
        super(props)

        this.state = {
            deleting: false,
            confirmation: false,
            validationError: ""
        }
    }

    toggleConfirmation = () => {
        this.setState((prevState)=>{
           return{ confirmation: !prevState.confirmation}
        })
    }

    setDeleting = () => {
        this.setState({
            deleting: true
        })
    }

    getProjectPayload = () => {
        return {
            id: this.props.id,
            name: this.props.name,
            active:this.props.active,
        }
    }

    saveProjectData = (event) => {
        const _projectExists = this.isProjectNameExists()
        if (!this.props.name) {
            this.setState({
                validationError: "This is a required field"
            })
            return
        }
        else if (_projectExists) {
            this.setState({
                validationError: "This Project already exists"
            })
            return
        }
        else {
            this.setState({
                validationError: ""
            })
        }
        event.preventDefault()
        this.props.saveProject(this.props.index)
    }

    isProjectNameExists(): boolean {
        return this.props.projects.some(({ name }, index) => name === this.props.name && index !== this.props.index)
    }

    renderCollapsedView() {
        return (
            <div className="project__row white-card white-card--add-new-item mb-16">
                <img src={folder} alt="" className="icon-dim-24 mr-16" />
                <span className="project-title">{this.props.name}</span>
                <button
                    type="button"
                    className="project__row__trash dc__transparent dc__align-right"
                    onClick={() => {
                        this.toggleConfirmation();
                    }}
                >
                    <Trash className="scn-5 icon-dim-20" />
                </button>
                {this.state.confirmation && (
                    <DeleteComponent
                        setDeleting={this.setDeleting}
                        deleteComponent={deleteProject}
                        payload={this.getProjectPayload()}
                        title={this.props.name}
                        toggleConfirmation={this.toggleConfirmation}
                        component={DeleteComponentsName.Project}
                        confirmationDialogDescription={DC_PROJECT_CONFIRMATION_MESSAGE}
                        reload={this.props.reload}
                    />
                )}
            </div>
        );
    }

    renderForm() {
        let isValid = this.props.isValid;
        let errorMessage = this.props.errorMessage;
        return (
            <div>
                <form
                    onSubmit={(e) => {
                        this.props.saveProject(this.props.index)
                    }}
                    className="white-card p-24 mb-16 dashed"
                >
                    <div className="white-card__header"> {this.props.id ? 'Edit project' : 'Add Project'} </div>
                    <label className="form__row">
                        <span className="form__label dc__required-field">Project name</span>
                        <input
                            type="text"
                            autoComplete="off"
                            name="name"
                            value={this.props.name}
                            placeholder="e.g. My Project"
                            className="form__input"
                            autoFocus
                            onChange={(event) => {
                                this.props.handleChange(event, this.props.index, 'name')
                            }}
                        />
                        {isValid.name ? null : <span className="form__error">{errorMessage.name}</span>}
                        {this.state.validationError && isValid.name ? (
                            <span className="form__error">
                                <>
                                    <Error className="form__icon form__icon--error" />
                                    {this.state.validationError}
                                </>
                            </span>
                        ) : null}
                    </label>
                    <div>
                        <div className="form__buttons">
                            <button type="button" className="cta cancel mr-16" onClick={this.props.onCancel}>
                                Cancel
                            </button>
                            <ButtonWithLoader
                                rootClassName="cta"
                                loaderColor="#ffffff"
                                isLoading={this.props.loadingData}
                                onClick={this.saveProjectData}
                            >
                                Save
                            </ButtonWithLoader>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        if (this.props.isCollapsed) {
            return this.renderCollapsedView();
        }
        else{
            return this.renderForm();
        }
    }
}
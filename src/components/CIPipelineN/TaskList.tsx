import React, { useState, useContext, Fragment } from 'react'
import { ReactComponent as Add } from '../../assets/icons/ic-add.svg'
import { ReactComponent as Drag } from '../../assets/icons/drag.svg'
import { ReactComponent as Dots } from '../../assets/icons/appstatus/ic-menu-dots.svg'
import { ReactComponent as Trash } from '../../assets/icons/ic-delete-interactive.svg'
import { ReactComponent as AlertTriangle } from '../../assets/icons/ic-alert-triangle.svg'
import { ReactComponent as QuestionFilled } from '../../assets/icons/ic-help.svg'
import { ReactComponent as MoveToPre } from '../../assets/icons/ic-arrow-backward.svg'
import { ciPipelineContext } from './CIPipeline'
import {
    PopupMenu,
    FormType,
    StepType,
    VariableType,
    FormErrorObjectType,
    TaskErrorObj,
    BuildStageVariable,
} from '@devtron-labs/devtron-fe-common-lib'
import { TaskListType } from '../ciConfig/types'

export function TaskList({ withWarning }: TaskListType) {
    const {
        formData,
        setFormData,
        addNewTask,
        activeStageName,
        selectedTaskIndex,
        setSelectedTaskIndex,
        calculateLastStepDetail,
        formDataErrorObj,
        setFormDataErrorObj,
        validateTask,
    }: {
        formData: FormType
        setFormData: React.Dispatch<React.SetStateAction<FormType>>
        addNewTask: () => void
        activeStageName: string
        selectedTaskIndex: number
        setSelectedTaskIndex: React.Dispatch<React.SetStateAction<number>>
        calculateLastStepDetail: (
            isFromAddNewTask: boolean,
            _formData: FormType,
            activeStageName: string,
            startIndex?: number,
        ) => {
            index: number
            calculatedStageVariables: Map<string, VariableType>[]
        }
        formDataErrorObj: FormErrorObjectType
        setFormDataErrorObj: React.Dispatch<React.SetStateAction<FormErrorObjectType>>
        validateTask: (taskData: StepType, taskErrorobj: TaskErrorObj) => void
    } = useContext(ciPipelineContext)
    const [dragItemStartIndex, setDragItemStartIndex] = useState<number>(0)
    const [dragItemIndex, setDragItemIndex] = useState<number>(0)
    const [dragAllowed, setDragAllowed] = useState<boolean>(false)
    const handleDragStart = (index: number): void => {
        setDragItemIndex(index)
        setDragItemStartIndex(index)
    }

    const handleDragEnter = (index: number): void => {
        const _formData = { ...formData }
        const newList = [..._formData[activeStageName].steps]
        const item = newList[dragItemIndex]
        newList.splice(dragItemIndex, 1)
        newList.splice(index, 0, item)
        setDragItemIndex(index)
        setSelectedTaskIndex(index)
        _formData[activeStageName].steps = newList
        const _formDataErrorObj = { ...formDataErrorObj }
        const newErrorList = [...formDataErrorObj[activeStageName].steps]
        const errorItem = newErrorList[dragItemIndex]
        newErrorList.splice(dragItemIndex, 1)
        newErrorList.splice(index, 0, errorItem)
        _formDataErrorObj[activeStageName].steps = newErrorList
        setFormData(_formData)
        setFormDataErrorObj(_formDataErrorObj)
    }

    const handleDrop = (index: number): void => {
        setDragAllowed(false)
        const _formData = { ...formData }
        calculateLastStepDetail(
            false,
            _formData,
            activeStageName,
            dragItemStartIndex < index ? dragItemStartIndex : index,
        )
        validateCurrentTask(index)
        setFormData(_formData)
        setDragItemStartIndex(index)
    }

    const deleteTask = (index: number): void => {
        const _formData = { ...formData }
        const newList = [..._formData[activeStageName].steps]
        const _taskDetail = newList.splice(index, 1)
        if (_taskDetail[0].isMandatory) {
            for (const task of newList) {
                if (task.pluginRefStepDetail?.pluginId === _taskDetail[0].pluginRefStepDetail.pluginId) {
                    task.isMandatory = true
                    break
                }
            }
        }
        _formData[activeStageName].steps = newList
        const newListLength = newList.length
        const newListIndex = newListLength > 1 ? newListLength - 1 : 0
        const newTaskIndex = index >= newListLength ? newListIndex : index
        calculateLastStepDetail(false, _formData, activeStageName, newTaskIndex)
        setTimeout(() => {
            setSelectedTaskIndex(newTaskIndex)
        }, 0)
        setFormData(_formData)
        const _formDataErrorObj = { ...formDataErrorObj }
        const newErrorList = [...formDataErrorObj[activeStageName].steps]
        newErrorList.splice(index, 1)
        _formDataErrorObj[activeStageName].steps = newErrorList
        setFormDataErrorObj(_formDataErrorObj)
    }

    const moveTask = (e): void => {
        const index = +e.currentTarget.dataset.index
        const _formData = { ...formData }
        const newList = [..._formData[activeStageName].steps]
        const _taskDetail = newList.splice(index, 1)
        _taskDetail[0].pluginRefStepDetail = {
            id: 0,
            pluginId: _taskDetail[0].pluginRefStepDetail.pluginId,
            conditionDetails: [],
            inputVariables: _taskDetail[0].pluginRefStepDetail.inputVariables || [],
            outputVariables: _taskDetail[0].pluginRefStepDetail.outputVariables || [],
        }
        const moveToStage =
            activeStageName === BuildStageVariable.PreBuild ? BuildStageVariable.PostBuild : BuildStageVariable.PreBuild
        _formData[moveToStage].steps.push(_taskDetail[0])
        _formData[activeStageName].steps = newList
        const newListLength = newList.length
        const newTaskIndex = index >= newListLength ? (newListLength > 1 ? newListLength - 1 : 0) : index
        calculateLastStepDetail(false, _formData, activeStageName, newTaskIndex)
        setTimeout(() => {
            setSelectedTaskIndex(newTaskIndex)
        }, 0)
        setFormData(_formData)
        const _formDataErrorObj = { ...formDataErrorObj }
        const newErrorList = [...formDataErrorObj[activeStageName].steps]
        newErrorList.splice(index, 1)
        _formDataErrorObj[activeStageName].steps = newErrorList

        _formDataErrorObj[moveToStage].steps.push({
            name: { isValid: true, message: null },
            isValid: true,
            pluginRefStepDetail: { inputVariables: [] },
        })
        setFormDataErrorObj(_formDataErrorObj)
    }

    function validateCurrentTask(index?: number): void {
        const _formDataErrorObj = { ...formDataErrorObj }
        validateTask(
            formData[activeStageName].steps[index || selectedTaskIndex],
            _formDataErrorObj[activeStageName].steps[index || selectedTaskIndex],
        )
        setFormDataErrorObj(_formDataErrorObj)
    }

    const handleSelectedTaskChange = (index: number): void => {
        validateCurrentTask()
        setSelectedTaskIndex(index)
    }

    return (
        <>
            <div className={`task-container pr-20 ${withWarning ? 'with-warning' : ''}`}>
                {formData[activeStageName].steps?.map((taskDetail, index) => (
                    <Fragment key={`task-item-${index}`}>
                        <div
                            className={`task-item fw-4 fs-13 pointer flex-justify ${
                                selectedTaskIndex === index ? 'task-item__selected-list' : ''
                            }`}
                            draggable={dragAllowed}
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDrop={() => handleDrop(index)}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => handleSelectedTaskChange(index)}
                        >
                            <Drag className="drag-icon" onMouseDown={() => setDragAllowed(true)} />
                            <div className="w-80 flex left">
                                <span className="dc__ellipsis-right">{taskDetail.name}</span>
                                {taskDetail.isMandatory && <span className="cr-5 ml-4">*</span>}
                            </div>
                            {formDataErrorObj[activeStageName].steps[index] &&
                                !formDataErrorObj[activeStageName].steps[index].isValid && (
                                    <AlertTriangle className="icon-dim-16 mr-5 ml-5 mt-2" />
                                )}
                            <PopupMenu autoClose>
                                <PopupMenu.Button isKebab>
                                    <Dots
                                        className="icon-dim-16 mt-2 rotate"
                                        style={{ ['--rotateBy' as any]: '90deg' }}
                                    />
                                </PopupMenu.Button>
                                <PopupMenu.Body>
                                    <div
                                        className="flex left p-8 pointer dc__hover-n50"
                                        onClick={(e) => deleteTask(index)}
                                    >
                                        <Trash className="icon-dim-16 mr-10" />
                                        Remove
                                    </div>
                                    {taskDetail.isMandatory && (
                                        <>
                                            <div
                                                className="flex left p-8 pointer dc__hover-n50"
                                                data-index={index}
                                                onClick={moveTask}
                                            >
                                                {activeStageName === BuildStageVariable.PreBuild ? (
                                                    <>
                                                        <MoveToPre
                                                            className="rotate icon-dim-16 mr-10"
                                                            style={{ ['--rotateBy' as any]: '180deg' }}
                                                        />
                                                        Move to post-build stage
                                                    </>
                                                ) : (
                                                    <>
                                                        <MoveToPre className="icon-dim-16 mr-10" />
                                                        Move to pre-build stage
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                className="flex left p-8 pointer dc__hover-n50"
                                                onClick={(e) => deleteTask(index)}
                                            >
                                                <QuestionFilled className="icon-dim-16 mr-10" />
                                                Why plugin is mandatory
                                            </div>
                                        </>
                                    )}
                                </PopupMenu.Body>
                            </PopupMenu>
                        </div>
                        <div className="vertical-line-connector"></div>
                    </Fragment>
                ))}
            </div>
            <div
                data-testid="sidebar-add-task-button"
                className="task-item add-task-container cb-5 fw-6 fs-13 flexbox mr-20"
                onClick={addNewTask}
            >
                <Add className="add-icon" /> Add task
            </div>
        </>
    )
}

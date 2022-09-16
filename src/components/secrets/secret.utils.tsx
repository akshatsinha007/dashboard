import React from 'react'
import { components } from 'react-select'
import { getCustomOptionSelectionStyle } from '../v2/common/ReactSelect.utils'
import { ReactComponent as InfoIcon } from '../../assets/icons/ic-info-outlined.svg'
import { ReactComponent as HelpIcon } from '../../assets/icons/ic-help.svg'
import { ReactComponent as OpenInNew } from '../../assets/icons/ic-open-in-new.svg'
import { multiSelectStyles, Progressing } from '../common'
import { NavLink } from 'react-router-dom'
import { ModuleNameMap, URLS } from '../../config'

export const CODE_EDITOR_RADIO_STATE = { DATA: 'data', SAMPLE: 'sample' }

export const CODE_EDITOR_RADIO_STATE_VALUE = { DATA: 'Data', SAMPLE: 'Sample' }

export const DATA_HEADER_MAP = { DEFAULT: 'default' }

export const VIEW_MODE = {
    YAML: 'yaml',
    GUI: 'gui',
}

export const sampleJSONs = {
    ESO_GoogleSecretsManager: {
        secretStore: {
            gcpsm: {
                auth: {
                    secretRef: {
                        secretAccessKeySecretRef: {
                            name: 'gcpsm-secret',
                            key: 'secret-access-credentials',
                        },
                    },
                },
                projectID: 'myProject',
            },
        },
        esoData: [
            {
                secretKey: 'prod-mysql-password',
                key: 'secrets/prod-mysql-secrets',
            },
            {
                secretKey: 'prod-mysql-password',
                key: 'secrets/prod-mysql-secrets',
            },
        ],
    },
    ESO_AWSSecretsManager: {
        secretStore: {
            aws: {
                service: 'SecretsManager',
                region: 'us-east-1',
                auth: {
                    secretRef: {
                        accessKeyIDSecretRef: {
                            name: 'awssm-secret',
                            key: 'access-key',
                        },
                        secretAccessKeySecretRef: {
                            name: 'awssm-secret',
                            key: 'secret-access-key',
                        },
                    },
                },
            },
        },
        esoData: [
            {
                secretKey: 'prod-mysql-password',
                key: 'secrets/prod-mysql-secrets',
                property: 'prodPassword',
            },
            {
                secretKey: 'prod-mysql-password',
                key: 'secrets/prod-mysql-secrets',
                property: 'prodPassword',
            },
        ],
    },
    ESO_AzureSecretsManager: {
        secretStore: {
            azurekv: {
                tenantId: 'd3bc2180-xxxx-xxxx-xxxx-154105743342',
                vaultUrl: 'https://my-keyvault-name.vault.azure.net',
                authSecretRef: {
                    clientId: {
                        name: 'azure-secret-sp',
                        key: 'ClientID',
                    },
                    clientSecret: {
                        name: 'azure-secret-sp',
                        key: 'ClientSecret',
                    },
                },
            },
        },
        esoData: [
            {
                secretKey: 'prod-mysql-password',
                key: 'secrets/prod-mysql-secrets',
            },
            {
                secretKey: 'prod-mysql-password',
                key: 'secrets/prod-mysql-secrets',
            },
        ],
    },
    ESO_HashiCorpVault: {
        secretStore: {
            vault: {
                server: 'http://my.vault.server:8200',
                path: 'secret',
                version: 'v2',
                auth: {
                    tokenSecretRef: {
                        name: 'vault-token',
                        key: 'token',
                    },
                },
            },
        },
        esoData: [
            {
                secretKey: 'prod-mysql-password',
                key: 'secrets/prod-mysql-secrets',
                property: 'prodPassword',
            },
            {
                secretKey: 'prod-mysql-password',
                key: 'secrets/prod-mysql-secrets',
                property: 'prodPassword',
            },
        ],
    },
    default: [
        {
            key: 'service/credentials',
            name: 'secret-key',
            property: 'property-name',
            isBinary: true,
        },
        {
            key: 'service/credentials',
            name: 'secret-key',
            property: 'property-name',
            isBinary: true,
        },
    ],
}

export const dataHeaders = {
    ESO_GoogleSecretsManager: (
        <div>
            #Sample Data
            <br />
            #secretKey: Name of the secret
            <br />
            #key: GCP secret name
            <br />
            #property: GCP Secrets Manager secret key
            <br />
            #secretAccessKeySecretRef.name: The secret name which would be used for authentication
            <br />
            #secretAccessKeySecretRef.key: Key name containing SA key
            <br />
            #projectID: GCP Project ID where secret is created
            <br />
        </div>
    ),
    ESO_AWSSecretsManager: (
        <div>
            #Sample Data <br />
            #accessKeyIDSecretRef.name: Name of secret created that would be used for authentication <br />
            #region: The region where Secret is created <br />
            #secretKey: Name of the secret created <br />
            #key: AWS Secrets Manager secret name <br />
            #property: AWS Secrets Manager secret key <br />
        </div>
    ),
    ESO_AzureSecretsManager: (
        <div>
            #Sample Data <br />
            #tenantId: azure tenant ID <br />
            #vaultUrl: URL of your vault instance <br />
            #authSecretRef.name: Name of secret created that would be used for authentication <br />
            #secretKey: Name of the secret <br />
            #key: Azure Key vault secret name <br />
        </div>
    ),
    ESO_HashiCorpVault: (
        <div>
            #Sample Data <br />
            #vault.server: Server URL where vault is running <br />
            #vault.path: Path where secret is stored <br />
            #tokenSecretRef.name: The secret name which would be used for authentication <br />
            #tokenSecretRef.key: Key name containing token <br />
            #secretKey: Name of the secret <br />
            #key: Vault secret name <br />
            #property: Vault secret key <br />
        </div>
    ),
    default: (
        <div>
            # Sample Data<br></br># key: Secret key in backend<br></br># name: Name for this key in the generated secret
            <br></br># property: Property to extract if secret in backend is a JSON object(optional)<br></br># isBinary:
            Set this to true if configuring an item for a binary file stored(optional)<br></br>
        </div>
    ),
}

export const getTypeGroups = (isESOModuleInstalled: boolean, typeValue?: string) => {
    const noGroups: any[] = [
            { value: '', label: 'Kubernetes Secret' },
            { value: 'KubernetesSecret', label: 'Mount Existing Kubernetes Secret' },
        ],
        esoGroups: any[] = [
            { value: 'ESO_GoogleSecretsManager', label: 'Google Secrets Manager' },
            { value: 'ESO_AWSSecretsManager', label: 'AWS Secrets Manager' },
            { value: 'ESO_AzureSecretsManager', label: 'Azure Secrets Manager' },
            { value: 'ESO_HashiCorpVault', label: 'Hashi Corp Vault' },
        ],
        ksoGroups: any[] = [
            { value: 'AWSSecretsManager', label: 'AWS Secrets Manager', deprecated: true },
            { value: 'AWSSystemManager', label: 'AWS System Manager', deprecated: true },
            { value: 'HashiCorpVault', label: 'Hashi Corp Vault', deprecated: true },
        ]

    if (isESOModuleInstalled) {
        return typeValue
            ? [...noGroups, ...esoGroups, ...ksoGroups].find((x) => x.value === typeValue)
            : [
                  {
                      label: '',
                      options: noGroups,
                  },
                  {
                      label: 'External Secret Operator (ESO)',
                      options: esoGroups,
                  },
                  {
                      label: 'Kubernetes External Secret (KES)',
                      options: ksoGroups,
                  },
              ]
    } else {
        return typeValue
            ? noGroups
            : [
                  {
                      label: '',
                      options: noGroups,
                  },
              ]
    }
}

export function SecretOptions(props) {
    props.selectProps.styles.option = getCustomOptionSelectionStyle()
    return (
        <components.Option {...props}>
            <div>
                <div>{props.data.label}</div>
                {props.data?.deprecated && <div className="cy-7 fw-4 fs-11">Deprecated</div>}
            </div>
        </components.Option>
    )
}

export function GroupHeading(props) {
    if (!props.data.label) return null
    return (
        <components.GroupHeading {...props}>
            <div className="flex flex-justify h-100">
                {props.data.label}
                <a className="flex" href="https://github.com/external-secrets/external-secrets" target="_blank">
                    <InfoIcon className="icon-dim-20 fcn-6" />
                </a>
            </div>
        </components.GroupHeading>
    )
}

export const groupStyle = () => {
    return {
        ...multiSelectStyles,
        menu: (base) => ({ ...base, zIndex: 9999, textAlign: 'left' }),
        control: (base) => ({ ...base, border: '1px solid #d6dbdf', width: '450px' }),
        group: (base) => ({
            ...base,
            paddingTop: 0,
            paddingBottom: 0,
        }),
        groupHeading: (base) => ({
            ...base,
            fontWeight: 600,
            fontSize: '12px',
            height: '28px',
            color: 'var(--N900)',
            backgroundColor: 'var(--N100)',
            marginBottom: 0,
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
        }),
    }
}

export const hasHashiOrAWS = (externalType): boolean => {
    return (
        externalType === 'AWSSecretsManager' || externalType === 'AWSSystemManager' || externalType === 'HashiCorpVault'
    )
}

export const hasESO = (externalType): boolean => {
    return (
        externalType === 'ESO_GoogleSecretsManager' ||
        externalType === 'ESO_AzureSecretsManager' ||
        externalType === 'ESO_AWSSecretsManager' ||
        externalType === 'ESO_HashiCorpVault'
    )
}

export const hasProperty = (externalType): boolean => {
    return externalType === 'ESO_AWSSecretsManager'
}

export const esoModuleInstallMenuList = (props): JSX.Element => {
    return (
        <components.MenuList {...props}>
            {props.children}
            <div className="flexbox pt-10 pr-12 pb-10 pl-12 bcv-1 m-8 br-4">
                <HelpIcon className="icon-dim-20 mr-8 fcv-5" />
                <div>
                    <div className="fs-13 fw-4 cn-9">Looking to use External Secrets?</div>
                    <div className="flexbox">
                        <span>
                            <NavLink
                                to={`${URLS.STACK_MANAGER_DISCOVER_MODULES_DETAILS}?id=${ModuleNameMap.ESO}`}
                                className="cb-5 fs-13 fw-6 anchor w-100 dc__no-decor"
                                target="_blank"
                            >
                                Install External secret integration
                            </NavLink>
                        </span>
                        <OpenInNew className="mt-2 ml-4" />
                    </div>
                </div>
            </div>
        </components.MenuList>
    )
}

export const esoMenuList = (props): JSX.Element => {
  return (
      <components.MenuList {...props}>
          {props.children}
      </components.MenuList>
  )
}

export const esoMenuListLoading = (props): JSX.Element => {
    return (
        <components.MenuList {...props}>
            {props.children}
            <div className="h-36">
                <Progressing />
            </div>
        </components.MenuList>
    )
}
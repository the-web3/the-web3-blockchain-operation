export enum OpKind {
    // eslint-disable-next-line no-unused-vars
    REVEAL = 'reveal',
    // eslint-disable-next-line no-unused-vars
    TRANSACTION = 'transaction',
    // eslint-disable-next-line no-unused-vars
    ACTIVATION = 'activate_account',
    // eslint-disable-next-line no-unused-vars
    DELEGATION = 'delegation' // 新增 delegation
}

export type PrepareOperationParams = {
    // eslint-disable-next-line no-use-before-define
    operation: RPCOperation | RPCOperation[];
    source: string;
};

export type RPCOperation =
// eslint-disable-next-line no-use-before-define
    | RPCTransferOperation
  // eslint-disable-next-line no-use-before-define
    | RPCRevealOperation
  // eslint-disable-next-line no-use-before-define
    | RPCDelegateOperation
  // eslint-disable-next-line no-use-before-define
    | RPCActivateOperation;

interface RPCTransferOperation {
    kind: OpKind.TRANSACTION;
    fee: number;
    gas_limit: number;
    storage_limit: number;
    amount: string;
    source: string;
    destination: string;
    parameters?: any;
}

export interface RPCRevealOperation {
    kind: OpKind.REVEAL;
    fee: number;
    public_key: string;
    source: string;
    gas_limit: number;
    storage_limit: number;
}

export interface RPCActivateOperation {
    kind: OpKind.ACTIVATION;
    pkh: string;
    secret: string;
}

export type OperationContents =
// eslint-disable-next-line no-use-before-define
    | OperationContentsActivateAccount
  // eslint-disable-next-line no-use-before-define
    | OperationContentsReveal
  // eslint-disable-next-line no-use-before-define
    | OperationContentsTransaction
  // eslint-disable-next-line no-use-before-define
    | OperationContentsDelegation;

export interface OperationContentsActivateAccount {
    kind: OpKind.ACTIVATION;
    pkh: string;
    secret: string;
}

export interface OperationContentsReveal {
    kind: OpKind.REVEAL;
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    public_key: string;
}

export interface OperationContentsTransaction {
    kind: OpKind.TRANSACTION;
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    amount: string;
    destination: string;
    // parameters?: TransactionOperationParameter;
}

export type RPCOpWithFee =
    | RPCTransferOperation
    | RPCDelegateOperation
    | RPCRevealOperation;

export interface PreparedOperation {
    opOb: {
        branch: string;
        contents: OperationContents[];
        protocol: string;
    };
    counter: number;
}

export interface RPCDelegateOperation {
    kind: OpKind.DELEGATION;
    source?: string;
    fee: number;
    gas_limit: number;
    storage_limit: number;
    delegate?: string;
}

export interface OperationContentsDelegation {
    kind: OpKind.DELEGATION;
    source?: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    delegate?: string;
}

export type RPCOpWithSource =
    | RPCTransferOperation
    | RPCDelegateOperation
    | RPCRevealOperation

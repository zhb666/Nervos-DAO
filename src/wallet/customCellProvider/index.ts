import {
  Indexer as IndexerType,
  CellProvider,
  CellCollector,
  QueryOptions
} from "@ckb-lumos/base";
import { TransactionSkeleton } from "@ckb-lumos/helpers";
import { Script } from '@ckb-lumos/lumos';
import { TEST_INDEXER } from "../../config";

class CustomCellProvider implements CellProvider {
  public readonly uri: string;

  constructor(
    private readonly indexer: IndexerType,
    private readonly myQueryOptions: QueryOptions
  ) {
    this.uri = indexer.uri;
  }

  collector(queryOptions: QueryOptions): CellCollector {
    console.log(this.indexer.collector({ ...queryOptions, ...this.myQueryOptions }),"haha");
    
    return this.indexer.collector({ ...queryOptions, ...this.myQueryOptions });
  }
}

function getCellProvider(queryOptions: QueryOptions = {}): CellProvider {
  return new CustomCellProvider(TEST_INDEXER, queryOptions);
}

function getEmptyCellProvider(queryOptions: QueryOptions = {}): CellProvider {

  return getCellProvider({ ...queryOptions, type: "empty" });
}

function getTransactionSkeleton(lock?:Script) {
  return TransactionSkeleton({
    cellProvider: getEmptyCellProvider({lock})
  });
}

export { getEmptyCellProvider, getTransactionSkeleton };



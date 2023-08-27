type IPageInfoType = {
  currentPage: number
  take: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

type IEdgeType<T> = {
  node: T
}

type IPagenatedType<T> = {
  pageInfo: IPageInfoType
  edges: IEdgeType<T>[]
}

export function OffsetPaginated<T>(classRef: Type<T>): Type<IPagenatedType<T>> {
  @ObjectType(`${classRef.name}PageInfo`)
  abstract class PageInfoType {
    @Field(() => Int)
    currentPage: number
    @Field(() => Int)
    take: number
    @Field(() => Int)
    totalCount: number
    @Field()
    hasNextPage: boolean
    @Field()
    hasPrevPage: boolean
  }

  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => classRef)
    node: T
  }

  @ObjectType({ abstract: true })
  abstract class PagenatedType implements IPagenatedType<T> {
    @Field(() => PageInfoType)
    pageInfo: PageInfoType

    @Field(() => [EdgeType])
    edges: EdgeType[] 
  }
}
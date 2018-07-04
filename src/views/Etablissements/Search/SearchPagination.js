import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const SearchPagination = props => (
  <Pagination>
    {props.self && props.self.page_number !== '1' &&
      props.prev && props.prev.page_number !== '1' ?
        <PaginationItem>
          <PaginationLink id="first" onClick={() => props.onClick('first')}>
            1
          </PaginationLink>
        </PaginationItem> : <div />}
    {props.self && parseInt(props.self.page_number, 10) > 2 ?
      <PaginationItem disabled>
        <PaginationLink>
          ...
        </PaginationLink>
      </PaginationItem> : <div />}
    {props.prev ?
      <PaginationItem>
        <PaginationLink id="prev" onClick={() => props.onClick(props.prev.url)}>
          {props.prev.page_number}
        </PaginationLink>
      </PaginationItem> : <div />}
    {props.self ?
      <PaginationItem active>
        <PaginationLink id="self">
          {props.self.page_number}
        </PaginationLink>
      </PaginationItem> : <div />}
    {props.next && props.next.page_number !== props.last.page_number ?
      <PaginationItem>
        <PaginationLink id="next" onClick={() => props.onClick(props.next.url)}>
          {props.next.page_number}
        </PaginationLink>
      </PaginationItem> : <div />}
    {props.last &&
      parseInt(props.last.page_number, 10) - parseInt(props.self.page_number, 10) > 2 ?
        <PaginationItem disabled>
          <PaginationLink>
            ...
          </PaginationLink>
        </PaginationItem> : <div /> }
    {props.last && props.self.page_number !== props.last.page_number ?
      <PaginationItem>
        <PaginationLink id="last" onClick={() => props.onClick(props.last.url)}>
          {props.last.page_number}
        </PaginationLink>
      </PaginationItem> : <div />}
  </Pagination>
);


SearchPagination.propTypes = {
  onClick: PropTypes.func.isRequired,
  last: PropTypes.object,
  next: PropTypes.object,
  prev: PropTypes.object,
  self: PropTypes.object,

};

export default SearchPagination;

import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import EmptyState from 'modules/common/components/EmptyState';
import Spinner from 'modules/common/components/Spinner';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import CustomerDetails from '../components/detail/CustomerDetails';
import { queries } from '../graphql';
import { CustomerDetailQueryResponse } from '../types';

type Props = {
  id: string;
};

type FinalProps = {
  customerDetailQuery: CustomerDetailQueryResponse;
} & Props;

class CustomerDetailsContainer extends React.Component<FinalProps, {}> {
  componentDidMount() {
    const { NODE_ENV } = process.env;

    if (NODE_ENV === 'production') {
      const win = window as any;

      win.APM_CUSTOMER_DETAIL_TRANSACTION = win.apm.startTransaction(
        'Customer detail',
        'Customers'
      );

      win.APM_CUSTOMER_DETAIL = win.APM_CUSTOMER_DETAIL_TRANSACTION.startSpan(
        'In did mount',
        'http'
      );
    }
  }

  render() {
    const { id, customerDetailQuery } = this.props;

    if (customerDetailQuery.loading) {
      return <Spinner objective={true} />;
    }

    if (!customerDetailQuery.customerDetail) {
      return (
        <EmptyState text="Customer not found" image="/images/actions/17.svg" />
      );
    }

    const taggerRefetchQueries = [
      {
        query: gql(queries.customerDetail),
        variables: { _id: id }
      }
    ];

    const updatedProps = {
      ...this.props,
      customer: customerDetailQuery.customerDetail || {},
      taggerRefetchQueries
    };

    const { NODE_ENV } = process.env;

    if (NODE_ENV === 'production') {
      const win = window as any;

      win.APM_CUSTOMER_DETAIL_TRANSACTION.end();
      win.APM_CUSTOMER_DETAIL.end();
    }

    return <CustomerDetails {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, CustomerDetailQueryResponse, { _id: string }>(
      gql(queries.customerDetail),
      {
        name: 'customerDetailQuery',
        options: ({ id }: { id: string }) => ({
          variables: {
            _id: id
          }
        })
      }
    )
  )(CustomerDetailsContainer)
);
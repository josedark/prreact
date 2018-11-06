import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Table,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  InputGroup,
  Input,
  InputGroupAddon,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  FiSearch,
} from 'react-icons/fi';
import { fetchOrders } from '../../actions';
import { OrderListItem } from '../../components';
import 'react-datepicker/dist/react-datepicker.css';

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = { activePage: 1 };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchOrders());
  }

  onViewClick = (id) => {
    const { history } = this.props;
    history.push(`/orders/${id}`);
  };

  render() {
    const { orders } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button
              color="link"
              onClick={() => this.props.history.push('/dashboard')}
            >
              <FormattedMessage id="sys.dashboard" />
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <FormattedMessage id="sys.orders" />
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="content-body">
          <Row className="table-container">
            <Col md={12} className="table-content">
              <div style={{display: 'flex', justifyContent: 'space-between'}}>                
                <div>
                  <InputGroup size="sm">
                    <Input placeholder={formatMessage({ id: 'sys.search' })} />
                    <InputGroupAddon addonType="append">
                      <Button color="secondary"><FiSearch /></Button>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <div>
                  <FormattedMessage id="sys.orderDate" />:&nbsp;
                  <DatePicker
                    dateFormat="YYYY-MM-DD"
                    selected={moment()}
                    popperModifiers={{
                      offset: {
                        enabled: true,
                        offset: '10px, 10px',
                      },
                    }}
                  />
                </div>
              </div><br />
              <Table responsive>
                <thead className="table-header">
                  <tr>
                    <th>
                      <FormattedMessage id="sys.orderNumber" />
                    </th>
                    <th>
                      <FormattedMessage id="sys.orderedBy" />
                    </th>
                    <th>
                      <FormattedMessage id="sys.orderDate" />
                    </th>
                    <th>
                      <FormattedMessage id="sys.payBy" />
                    </th>
                    <th>
                      <FormattedMessage id="sys.orderStatus" />
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <OrderListItem
                      key={order.id}
                      number={order.number}
                      customer={order.customer}
                      date={order.date}
                      payment={order.payment}
                      status={order.status}
                      onClick={this.onViewClick}
                    />
                  ))}
                </tbody>
              </Table>
              <Pagination aria-label="Page navigation example">
                <PaginationItem disabled>
                  <PaginationLink previous href="#" />
                </PaginationItem>
                <PaginationItem active>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink next href="#" />
                </PaginationItem>
              </Pagination>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

OrderList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  orders: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  orders: state.orderReducer.orders,
});

export default connect(
  mapStateToProps,
  null
)(injectIntl(withRouter(OrderList)));

import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { Button, CircularProgress } from '@mui/material';
import { Plan } from 'services/subscription';
import {
  PLAN_STARTER,
  PLAN_PREFERRED,
  PLAN_PREMIUM,
  PLAN_SELF_MANAGE,
} from '../constants';

const useStyles = makeStyles((theme) => ({
  page_wrapper: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 20px',
  },
  price_block: {
    fontFamily: 'Telegraf',
    backgroundColor: '#317e4f',
    padding: '50px 0 75px 0',
  },
  price_plans_container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  price_plan: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    width: 'calc(33.33% - 30px)',
    minWidth: '230px',
    padding: '40px 30px 20px',
    border: '1px solid rgba(31,49,97,0.5)',
    boxSizing: 'border-box',
    boxShadow:
      '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px rgb(0 0 0 / 14%), 0px 1px 5px rgb(0 0 0 / 12%)',
    [theme.breakpoints.down('lg')]: {
      width: 'calc(33.33% - 10px)',
    },
  },
  populared: {
    border: '8px solid #172447',
    position: 'relative',
    width: 'calc(33.33% - 22px)',
    margin: '-8px',
  },
  populared_label: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16.8px',
    lineHeight: '17px',
    letterSpacing: '.196px',
    color: '#fff',
    background: '#172447',
    padding: '5px 12px',
    borderRadius: '64px',
    top: '-16px',
    position: 'absolute',
    left: '50%',
    textAlign: 'center',
    transform: 'translateX(-50%)',
  },
  price_plan_block: {
    marginBottom: '25px',
    textAlign: 'center',
  },
  price_plan_name: {
    fontWeight: 800,
    fontSize: '40px',
    lineHeight: '42px',
    textAlign: 'center',
    color: '#1f3161',
    marginBottom: '8px',
  },
  price_plan_description: {
    fontFamily: 'SF Pro Display',
    fontSize: '14px',
    lineHeight: '17px',
    minHeight: '100px',
    color: '#1f3161',
    marginBottom: '14px',
  },
  price_plan_price: {
    fontWeight: 800,
    fontSize: '48px',
    lineHeight: '51px',
    textAlign: 'center',
    color: '#1f3161',
  },
  price_plan_old_price: {
    fontWeight: 800,
    fontSize: '24px',
    lineHeight: '25px',
    textAlign: 'center',
    color: '#1f3161',
    position: 'relative',
    display: 'inline-block',
    padding: '0 20px 8px 20px',
    borderBottom: '1px solid #ededed',
  },
  red_line: {
    height: '1px',
    width: '150px',
    background: '#e81c0d',
    position: 'absolute',
    top: 'calc(50% - 5px)',
    right: 0,
  },
  per_month: {
    color: '#1f3161',
    fontSize: '25px',
    textAlign: 'center',
    fontWeight: 800,
    lineHeight: '25px',
  },
  price_plan_price_description: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#1f3161',
    lineHeight: 1.5,
  },
  text_center: {
    textAlign: 'center',
  },
  price_plan_details_container: {
    minHeight: '380px',
    marginBottom: '20px',
  },
  price_plan_price_detail_name: {
    fontFamily: 'SF Pro Display',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '17px',
    color: '#1f3161',
    marginBottom: '5px',
  },
  price_plan_price_detail_description: {
    fontFamily: 'SF Pro Display',
    fontSize: '12px',
    lineHeight: '14px',
    color: '#1f3161',
    marginBottom: '12px',
  },
  price_plan_join: {
    display: 'flex',
    justifyContent: 'center',
  },
  self_managed_plan_header: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: '24px',
    lineHeight: '25px',
    color: '#fde4c1',
    marginBottom: '15px',
    marginTop: '70px',
  },
  self_managed_plan_header_description: {
    margin: '0 auto',
    maxWidth: '660px',
    fontFamily: 'SF Pro Display',
    fontSize: '14px',
    lineHeight: '17px',
    color: '#fff',
  },
  self_managed_plan: {
    background: '#fff',
    boxShadow:
      '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px rgb(0 0 0 / 14%), 0px 1px 5px rgb(0 0 0 / 12%)',
    maxWidth: '970px',
    margin: '30px auto 0 auto',
    display: 'flex',
    padding: '18px 25px',
    alignItems: 'center',
  },
  smp_heading: {
    fontWeight: 800,
    fontSize: '24px',
    lineHeight: '25px',
    textAlign: 'center',
    color: '#1f3161',
    marginRight: '30px',
  },
  smp_benifits: {
    display: 'flex',
    flexGrow: 1,
    flex: 1,
  },
  smp_benifits_list: {
    padding: '0px',
    margin: '0px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  smp_benifits_list_item: {
    fontFamily: 'SF Pro Display',
    fontSize: '14px',
    lineHeight: '17px',
    color: '#1f3161',
    background: 'url(./right.svg) no-repeat left center',
    display: 'block',
    paddingLeft: '30px',
    marginBottom: '10px',
  },
  smp_price_container: {
    textAlign: 'center',
    marginRight: '40px',
  },
  smp_price: {
    fontWeight: 800,
    fontSize: '24px',
    lineHeight: '25px',
    textAlign: 'center',
    color: '#1f3161',
    marginBottom: '0px',
  },
  smp_price_description: {
    margin: '0px',
    fontFamily: 'SF Pro Display',
    fontSize: '14px',
    lineHeight: '17px',
    textAlign: 'center',
    color: '#1f3161',
  },
  loader: {
    marginLeft: theme.spacing(2),
  },
}));

interface IPlans {
  plans: Plan[];
  onJoin: (plan: Plan) => void;
  hideFooter: boolean;
  isLoading: boolean;
}

const Plans = ({
  plans, onJoin, hideFooter, isLoading = false,
}: IPlans) => {
  const classes = useStyles();

  let planPremium: Plan;
  let planPreferred: Plan;
  let planStarter: Plan;
  let planSelfManage: Plan;

  plans.forEach((plan) => {
    if (plan.name === PLAN_PREMIUM) {
      planPremium = plan;
    } else if (plan.name === PLAN_PREFERRED) {
      planPreferred = plan;
    } else if (plan.name === PLAN_STARTER) {
      planStarter = plan;
    } else if (plan.name === PLAN_SELF_MANAGE) {
      planSelfManage = plan;
    }
  });

  const getPrice = (plan: Plan) => {
    if (!plan) {
      return '';
    }
    return plan.price.split('.00 USD /mo')[0];
  };

  return (
    <div className={classes.price_block}>
      <div className={classes.page_wrapper}>
        <div className={classes.price_plans_container}>
          <div className={classes.price_plan}>
            <div className={classes.price_plan_name}>Premium</div>
            <div className={classes.price_plan_description}>
              Designed to meet the needs of high earners looking to maximize tax
              savings and channel earnings into tax advantaged investment
              options.
            </div>
            <div className={classes.price_plan_block}>
              <div className={classes.price_plan_price}>
                {`${getPrice(planPremium)}`}
                <span className={classes.per_month}>/mo</span>
              </div>
              <div className={classes.price_plan_old_price}>
                $450
                <span className={classes.per_month}>/mo</span>
                <div className={classes.red_line} />
              </div>
              <div className={classes.price_plan_price_description}>
                <div className={classes.text_center}>
                  + $199 One-Time Setup Cost
                </div>
                <div className={classes.text_center}>
                  + Additional State Fees
                </div>
              </div>
            </div>

            <div className={classes.price_plan_details_container}>
              <div className={classes.price_plan_price_detail_name}>
                Tax Savings
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Those making more than $120K can save $11,000 or more per year.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                S-Corp Setup & Management
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Get established as an S-Corp and we’ll handle all the compliance
                requirements associated with it.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Business Banking
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Establish a business banking account to untangle personal and
                business finances.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Bookkeeping & Accounting
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Connect unlimited business banking and credit card accounts.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Tax Strategy & Preparation
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Includes regular tax planning sessions and preparation of all
                business tax filing.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Retirement Savings
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Channel pre-tax funds into tax-advantaged retirement accounts.
              </div>
            </div>
            <div className={classes.price_plan_join}>
              <Button
                className={classes.button}
                size="large"
                variant="outlined"
                color="secondary"
                disabled={isLoading}
                onClick={() => onJoin(planPremium)}
              >
                Select Premium
                {isLoading && (
                  <CircularProgress className={classes.loader} size={20} />
                )}
              </Button>
            </div>
          </div>

          <div className={clsx(classes.price_plan, classes.populared)}>
            <div className={classes.populared_label}>Most Popular</div>
            <div className={classes.price_plan_name}>Preferred</div>
            <div className={classes.price_plan_description}>
              Perfect for those regularly exceeding $60K in annual income who
              are seeking tax savings and improved financial health in their
              business.
            </div>
            <div className={classes.price_plan_block}>
              <div className={classes.price_plan_price}>
                $
                {getPrice(planPreferred)}
                <span className={classes.per_month}>/mo</span>
              </div>
              <div className={classes.price_plan_old_price}>
                $350
                <span className={classes.per_month}>/mo</span>
                <div className={classes.red_line} />
              </div>
              <div className={classes.price_plan_price_description}>
                <div className={classes.text_center}>
                  + $199 One-Time Setup Cost
                </div>
                <div className={classes.text_center}>
                  + Additional State Fees
                </div>
              </div>
            </div>

            <div className={classes.price_plan_details_container}>
              <div className={classes.price_plan_price_detail_name}>
                Tax Savings
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Those making more than $60K can save $7,500 or more per year.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                S-Corp Setup & Management
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Get established as an S-Corp and we’ll handle all the compliance
                requirements associated with it.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Business Banking
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Establish a business banking account to untangle personal and
                business finances.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Bookkeeping & Accounting
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Connect up to 5 business banking and credit card accounts.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Tax Strategy & Preparation
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Includes regular tax planning sessions and preparation of all
                business tax filing.
              </div>
            </div>
            <div className={classes.price_plan_join}>
              <Button
                className={classes.button}
                size="large"
                variant="contained"
                color="secondary"
                disabled={isLoading}
                onClick={() => onJoin(planPreferred)}
                data-testid="join-preferred"
              >
                Select Preferred
                {isLoading && (
                  <CircularProgress className={classes.loader} size={20} />
                )}
              </Button>
            </div>
          </div>

          <div className={classes.price_plan}>
            <div className={classes.price_plan_name}>Starter</div>
            <div className={classes.price_plan_description}>
              Forming an LLC and offloading tedious back-office finance tasks is
              the first step for those on the path to making $60K per year.
            </div>
            <div className={classes.price_plan_block}>
              <div className={classes.price_plan_price}>
                {`${getPrice(planStarter)}`}
                <span className={classes.per_month}>/mo</span>
              </div>
              <div className={classes.price_plan_old_price}>
                $199
                <span className={classes.per_month}>/mo</span>
                <div className={classes.red_line} />
              </div>
              <div className={classes.price_plan_price_description}>
                <div className={classes.text_center}>
                  + $199 One-Time Setup Cost
                </div>
                <div className={classes.text_center}>
                  + Additional State Fees
                </div>
              </div>
            </div>

            <div className={classes.price_plan_details_container}>
              <div className={classes.price_plan_price_detail_name}>
                Low Income Threshold
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Basic LLC is sufficient for those making less than $60K.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Incorporation
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Setup of a Limited Liability Company (LLC).
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Business Banking
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Establish a business banking account to untangle personal and
                business finances.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Bookkeeping & Accounting
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Connect up to 2 business banking accounts.
              </div>
              <div className={classes.price_plan_price_detail_name}>
                Schedule C Tax Preparation
              </div>
              <div className={classes.price_plan_price_detail_description}>
                Includes preparation of Schedule C tax form to include with your
                1040 Personal Tax Return.
              </div>
            </div>
            <div className={classes.price_plan_join}>
              <Button
                className={classes.button}
                size="large"
                variant="outlined"
                color="secondary"
                disabled={isLoading}
                onClick={() => onJoin(planStarter)}
              >
                Select Starter
                {isLoading && (
                  <CircularProgress className={classes.loader} size={20} />
                )}
              </Button>
            </div>
          </div>
        </div>
        {!hideFooter && (
          <div className={classes.self_managed_plan_container}>
            <div className={classes.self_managed_plan_header}>
              Just Interested in Incorporating?
            </div>
            <div className={classes.self_managed_plan_header_description}>
              We can do that, too. We&apos;ll setup an LLC and file the
              necessary election paperwork to the IRS to legally establish it as
              an SCorporation for tax purposes. If you have the wherewithal to
              manage an S-Corp on your own, have at it!
            </div>

            <div className={classes.self_managed_plan}>
              <div className={classes.smp_heading}>Self-Managed</div>
              <div className={classes.smp_benifits}>
                <ul className={classes.smp_benifits_list}>
                  <li className={classes.smp_benifits_list_item}>
                    One-time LLC Formation
                  </li>
                  <li className={classes.smp_benifits_list_item}>
                    Business Bank Account Creation
                  </li>
                </ul>
                <ul className={classes.smp_benifits_list}>
                  <li className={classes.smp_benifits_list_item}>
                    S-Corp Election &amp; Registration
                  </li>
                  <li className={classes.smp_benifits_list_item}>
                    Articles of Incorporation
                  </li>
                </ul>
              </div>
              <div className={classes.smp_price_container}>
                <div className={classes.smp_price}>
                  {`${getPrice(planSelfManage)}`}
                </div>
                <div className={classes.smp_price_description}>
                  (One-time cost, not
                  {' '}
                  <br />
                  including state fees)
                </div>
              </div>
              <div className={classes.price_plan_join}>
                <Button
                  className={classes.button}
                  size="medium"
                  variant="contained"
                  color="secondary"
                  onClick={() => onJoin(planSelfManage)}
                >
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;

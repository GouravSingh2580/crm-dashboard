/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import CompanyLogo from 'icons/marketing_company_logo.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionPopulared = withStyles((theme) => ({
  root: {
    border: '4px solid #172447',
  },
}))(Accordion);

const AccordionDetailsStyled = withStyles((theme) => ({
  root: {
    display: 'block',
    padding: '0 16px',
  },
}))(AccordionDetails);

const AccordionSummaryStyled = withStyles((theme) => ({
  content: {
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
}))(AccordionSummary);

const useStyles = makeStyles((theme) => ({
  hr_line_bottom: {
    position: 'absolute',
    borderBottom: '1px solid #e0e0e0',
    width: '35px',
    bottom: 0,
  },
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
  price_plans_container: {},
  price_plan: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    width: 'calc(33.33% - 30px)',
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
  },
  populared_label: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
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
    transform: 'translateX(-50%)',
  },
  price_plan_block: {
    marginBottom: '25px',
    textAlign: 'center',
  },
  price_plan_name: {
    fontWeight: 800,
    fontSize: '24px',
    lineHeight: '25px',
    color: '#1f3161',
    margin: 0,
  },
  price_plan_description: {
    position: 'relative',
    fontFamily: 'SF Pro Display',
    fontWeight: 'bold',
    paddingBottom: '10px',
    fontSize: '14px',
    color: '#1f3161',
    marginBottom: '14px',
  },
  price_plan_price: {
    fontWeight: 800,
    fontSize: '24px',
    color: '#1f3161',
    lineHeight: 1.5,
  },
  price_plan_old_price: {
    position: 'relative',
    fontWeight: 800,
    fontSize: '18px',
    lineHeight: '19px',
    color: '#1f3161',
    textAlign: 'right',
    marginRight: '30px',
  },
  red_line: {
    height: '1px',
    width: '100px',
    background: '#e81c0d',
    position: 'absolute',
    top: 'calc(50% - 3px)',
    right: 0,
    transform: 'translate(10%)',
  },
  per_month: {
    color: '#1f3161',
    fontSize: '12px',
    lineHeight: '13px',
    fontWeight: 400,
  },
  price_plan_price_description: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#1f3161',
    lineHeight: 1.5,
    textAlign: 'right',
    marginTop: '10px',
  },
  price_plan_details_container: {
    marginBottom: '20px',
  },
  price_plan_price_detail_name: {
    fontFamily: 'SF Pro Display',
    fontWeight: 'bold',
    fontSize: '12px',
    lineHeight: '14px',
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
  windermere: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    lineHeight: '17px',
    color: '#1f3161',
    marginTop: '20px',
    marginBottom: '10px',
  },
  windermere_logo: {
    width: '28px',
    marginRight: '5px',
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
    borderRadius: '16px',
    background: '#fff',
    boxShadow:
      '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px rgb(0 0 0 / 14%), 0px 1px 5px rgb(0 0 0 / 12%)',
    maxWidth: '970px',
    margin: '30px auto 0 auto',
    padding: '18px 25px',
    alignItems: 'center',
  },
  smp_heading: {
    fontWeight: 800,
    fontSize: '24px',
    lineHeight: '25px',
    textAlign: 'center',
    color: '#1f3161',
  },
  smp_benifits: {
    display: 'flex',
    padding: '10px',
    justifyContent: 'center',
  },
  smp_benifits_list: {
    padding: '0px',
    margin: '0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  smp_benifits_list_item: {
    fontFamily: 'SF Pro Display',
    fontSize: '12px',
    lineHeight: '14px',
    color: '#1f3161',
    background: 'url(./right.svg) no-repeat left center',
    display: 'block',
    paddingLeft: '30px',
    marginBottom: '10px',
  },
  smp_price_container: {
    justifyContent: 'center',
    display: 'flex',
    padding: '10px',
  },
  smp_price: {
    fontWeight: 800,
    fontSize: '24px',
    lineHeight: '25px',
    textAlign: 'center',
    color: '#1f3161',
    marginBottom: '0px',
    marginRight: '10px',
  },
  smp_price_description: {
    margin: '0px',
    fontFamily: 'SF Pro Display',
    fontSize: '14px',
    lineHeight: '17px',
    textAlign: 'center',
    color: '#1f3161',
  },
}));

// eslint-disable-next-line react/prop-types
const PricingMobile = ({ plans, onJoin }) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState('panel2');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getPrice = (planName) => {
    // eslint-disable-next-line react/prop-types
    const plan = plans.find((item) => item.name === planName);
    return plan.price.split('.00 USD /mo')[0];
  };

  return (
    <div className={classes.price_block}>
      <div className={classes.page_wrapper}>
        <div className={classes.price_plans_container}>
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummaryStyled expandIcon={<ExpandMoreIcon />}>
              <div className={classes.price_plan_name}>Premium</div>
              <div className={classes.price_plan_price}>
                $
                {getPrice('Premium')}
                <span className={classes.per_month}>/mo</span>
              </div>
            </AccordionSummaryStyled>
            <AccordionDetailsStyled className={classes.accordion_details}>
              <div className={classes.price_plan_old_price}>
                $450
                <span className={classes.per_month}>/mo</span>
                <div className={classes.red_line} />
              </div>
              <div className={classes.price_plan_price_description}>
                <div>+ $199 One-Time Setup Cost</div>
                <div>+ Additional State Fees</div>
              </div>
              <div className={classes.price_plan_description}>
                Designed to meet the needs of high earners looking to maximize
                tax savings and channel earnings into tax advantaged investment
                options.
                <div className={classes.hr_line_bottom} />
              </div>
              <div className={classes.price_plan_details_container}>
                <div className={classes.price_plan_price_detail_name}>
                  Tax Savings
                </div>
                <div className={classes.price_plan_price_detail_description}>
                  Those making more than $120K can save $11,000 or more per
                  year.
                </div>
                <div className={classes.price_plan_price_detail_name}>
                  S-Corp Setup & Management
                </div>
                <div className={classes.price_plan_price_detail_description}>
                  Get established as an S-Corp and we’ll handle all the
                  compliance requirements associated with it.
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
                  onClick={() => onJoin('Premium')}
                >
                  Join Now
                </Button>
              </div>
              <div className={classes.windermere}>
                <img
                  src={CompanyLogo}
                  className={classes.windermere_logo}
                  alt="logo"
                />
                Preferred pricing for our Windermere partners
              </div>
            </AccordionDetailsStyled>
          </Accordion>

          <AccordionPopulared
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummaryStyled expandIcon={<ExpandMoreIcon />}>
              <div className={classes.price_plan_name}>Preferred</div>
              <div className={classes.price_plan_price}>
                $
                {getPrice('Preferred')}
                <span className={classes.per_month}>/mo</span>
              </div>
            </AccordionSummaryStyled>
            <AccordionDetailsStyled className={classes.accordion_details}>
              <div className={classes.price_plan_old_price}>
                $350
                <span className={classes.per_month}>/mo</span>
                <div className={classes.red_line} />
              </div>
              <div className={classes.price_plan_price_description}>
                <div>+ $199 One-Time Setup Cost</div>
                <div>+ Additional State Fees</div>
              </div>
              <div className={classes.price_plan_description}>
                Perfect for those regularly exceeding $60K in annual income who
                are seeking tax savings and improved financial health in their
                business.
                <div className={classes.hr_line_bottom} />
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
                  Get established as an S-Corp and we’ll handle all the
                  compliance requirements associated with it.
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
                  onClick={() => onJoin('Preferred')}
                >
                  Join Now
                </Button>
              </div>
              <div className={classes.windermere}>
                <img
                  src={CompanyLogo}
                  className={classes.windermere_logo}
                  alt="logo"
                />
                Preferred pricing for our Windermere partners
              </div>
            </AccordionDetailsStyled>
          </AccordionPopulared>

          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <AccordionSummaryStyled expandIcon={<ExpandMoreIcon />}>
              <div className={classes.price_plan_name}>Starter</div>
              <div className={classes.price_plan_price}>
                $
                {getPrice('Starter')}
                <span className={classes.per_month}>/mo</span>
              </div>
            </AccordionSummaryStyled>
            <AccordionDetailsStyled className={classes.accordion_details}>
              <div className={classes.price_plan_old_price}>
                $199
                <span className={classes.per_month}>/mo</span>
                <div className={classes.red_line} />
              </div>
              <div className={classes.price_plan_price_description}>
                <div>+ $199 One-Time Setup Cost</div>
                <div>+ Additional State Fees</div>
              </div>
              <div className={classes.price_plan_description}>
                Forming an LLC and offloading tedious back-office finance tasks
                is the first step for those on the path to making $60K per
                year.
                <div className={classes.hr_line_bottom} />
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
                  Includes preparation of Schedule C tax form to include with
                  your 1040 Personal Tax Return.
                </div>
              </div>
              <div className={classes.price_plan_join}>
                <Button
                  className={classes.button}
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={() => onJoin('Starter')}
                >
                  Join Now
                </Button>
              </div>
              <div className={classes.windermere}>
                <img
                  src={CompanyLogo}
                  className={classes.windermere_logo}
                  alt="logo"
                />
                Preferred pricing for our Windermere partners
              </div>
            </AccordionDetailsStyled>
          </Accordion>
        </div>

        <div className={classes.self_managed_plan_container}>
          <div className={classes.self_managed_plan_header}>
            Just Interested in Incorporating?
          </div>
          <div className={classes.self_managed_plan_header_description}>
            We can do that, too. We&apos;ll setup an LLC and file the necessary
            election paperwork to the IRS to legally establish it as an
            SCorporation for tax purposes. If you have the wherewithal to manage
            an S-Corp on your own, have at it!
          </div>

          <div className={classes.self_managed_plan}>
            <div className={classes.smp_heading}>Self-Managed</div>
            <div className={classes.smp_price_container}>
              <div className={classes.smp_price}>
                $
                {getPrice('Self-Managed')}
              </div>
              <div className={classes.smp_price_description}>
                (One-time cost, not
                {' '}
                <br />
                including state fees)
              </div>
            </div>
            <div className={classes.smp_benifits}>
              <ul className={classes.smp_benifits_list}>
                <li className={classes.smp_benifits_list_item}>
                  One-time LLC Formation
                </li>
                <li className={classes.smp_benifits_list_item}>
                  Business Bank Account Creation
                </li>
                <li className={classes.smp_benifits_list_item}>
                  S-Corp Election &amp; Registration
                </li>
                <li className={classes.smp_benifits_list_item}>
                  Articles of Incorporation
                </li>
              </ul>
            </div>

            <div className={classes.price_plan_join}>
              <Button
                className={classes.button}
                size="medium"
                variant="contained"
                color="secondary"
                onClick={() => onJoin('Self-Managed')}
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingMobile;

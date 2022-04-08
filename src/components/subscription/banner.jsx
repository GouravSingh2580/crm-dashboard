import makeStyles from '@mui/styles/makeStyles';
import BannerImage from 'icons/banner-image.png';

const useStyles = makeStyles((theme) => ({
  page_wrapper: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 20px',
  },
  banner_block: {
    fontFamily: 'Telegraf',
    backgroundColor: '#fafafa',
    padding: '30px 0',
  },
  banner: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column-reverse',
    },
  },
  banner_text: {
    width: '100%',
    paddingRight: '50px',
  },
  banner_img: {
    width: '100%',
    marginBottom: '20px',
  },
  banner_text_header: {
    fontSize: '56px',
    fontWeight: 800,
    lineHeight: '59px',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#317e4f',
    marginBottom: '50px',
  },
  banner_content: {
    maxWidth: '555px',
  },
  formations_provide: {
    padding: '40px 0px 26px',
    position: 'relative',
    margin: '60px 0px 10px',
  },
  hr_line_top: {
    position: 'absolute',
    borderTop: '1px solid #000',
    width: '32px',
    top: 0,
  },
  hr_line_bottom: {
    position: 'absolute',
    borderBottom: '1px solid #000',
    width: '32px',
    bottom: 0,
  },
  text_header: {
    fontSize: '24px',
    fontWeight: 800,
    lineHeight: '25px',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#1f3161',
    marginBottom: '8px',
  },
  text_description: {
    fontFamily: 'SF Pro Display',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '17px',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#1f3161',
    marginTop: '0px',
    marginBottom: '14px',
  },
  mob_image_container: {
    maxWidth: '100%',
    height: 'auto',
  },
  mob_image: {
    width: '100%',
    maxWidth: '500px',
  },
}));

// const style = {
//   opacity: 1,
//   backgroundColor: 'transparent',
//   position: 'absolute',
//   top: '0px',
//   left: '0px',
//   width: '100%',
//   maxWidth: '444px',
// };

const Banner = () => {
  const classes = useStyles();

  return (
    <div className={classes.banner_block}>
      <div className={classes.page_wrapper}>
        <div className={classes.banner}>
          <div className={classes.banner_text}>
            <div className={classes.banner_text_header}>
              Less Taxes.
              {' '}
              <br />
              More Benefits.
              {' '}
              <br />
              Greater Peace of Mind.
            </div>
            <div className={classes.banner_content}>
              <div className={classes.text_header}>
                It&apos;s like having a Transaction Coordinator for your Finances
              </div>
              <div className={classes.text_description}>
                We&apos;re a complete financial health solution for the
                self-employed, especially real estate agents. Basically, we
                handle the tedious financial stuff within your business that
                takes you away from your clients and making money. Bookkeeping &
                Accounting? Yep. Legal Compliance? Of course. Taxes? Most
                certainly - and we&apos;ll likely save you more than $7,500* per
                year.
              </div>
            </div>

            <div className={classes.formations_provide}>
              <div className={classes.hr_line_top} />

              <div className={classes.text_header}>Save on Taxes</div>
              <div className={classes.text_description}>
                Our average customer saves over $7,500* per year.
              </div>

              <div className={classes.text_header}>
                Access to Better Benefits
              </div>
              <div className={classes.text_description}>
                401k, Health Insurance, HSAs, FSAs…give yourself everything a
                corporate employee enjoys.
              </div>

              <div className={classes.text_header}>Save Time and Headaches</div>
              <div className={classes.text_description}>
                We handle your financials, freeing you to do what you love!
              </div>

              <div className={classes.hr_line_bottom} />
            </div>
          </div>
          <div className={classes.banner_img}>
            <div className={classes.mob_image_container}>
              <img
                className={classes.mob_image}
                src={BannerImage}
                loading="lazy"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

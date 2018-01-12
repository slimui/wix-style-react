import story from 'story';

import readme from '../../src/DatePicker/README.md';
import source from '!raw-loader!wix-style-react/DatePicker/DatePicker';
import component from 'wix-style-react/DatePicker';
import readmeTestkit from '../../src/DatePicker/README.TESTKIT.md';
import format from 'date-fns/format';

story({
  category: 'Core',
  name: 'DatePicker',
  readme,
  readmeTestkit,
  source,
  component,
  componentProps: setProps => ({
    onChange: value => setProps({value}),
    dateFormat: 'YYYY/MM/DD',
    dataHook: 'storybook-datepicker',
    value: new Date('2017/05/01')
  }),
  exampleProps: {
    onChange: date => format(date, 'YYYY/MM/DD')
  }
});

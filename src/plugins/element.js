import Vue from 'vue'
import { CarouselItem, Carousel, TimelineItem, Timeline, Upload, Checkbox, CheckboxGroup, Steps, Step, TabPane, Tabs, Alert, Cascader, Select, Option, Tree, Tag, MessageBox, Dialog, Pagination, Tooltip, Switch, TableColumn, Table, Row, Col, Card, BreadcrumbItem, Breadcrumb, Menu, Submenu, MenuItem, Container, Header, Aside, Main, Message, Button, Form, FormItem, Input } from 'element-ui'

Vue.use(CarouselItem)
Vue.use(Carousel)
Vue.use(TimelineItem)
Vue.use(Timeline)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Steps)
Vue.use(Step)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

// 挂载弹框组件
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

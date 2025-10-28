<!-- c-form 依赖功能示例 -->
<template>
  <div class="dependency-example-page">
    <ElCard header="表单依赖功能示例">
      <ElTabs v-model="activeTab">
        <!-- 示例1: 基础依赖回调 -->
        <ElTabPane label="基础依赖回调" name="basic">
          <ElCard header="年龄自动分类">
            <ArtForm v-model="basicFormData" :items="basicFormItems" label-width="120px" />
            <ElDivider />
            <pre>{{ basicFormData }}</pre>
          </ElCard>
        </ElTabPane>

        <!-- 示例2: 地区级联 -->
        <ElTabPane label="地区级联（模拟）" name="region">
          <ElCard header="省市区三级联动">
            <ArtForm v-model="regionFormData" :items="regionFormItems" label-width="120px" />
            <ElDivider />
            <pre>{{ regionFormData }}</pre>
          </ElCard>
        </ElTabPane>

        <!-- 示例3: 商品分类联动 -->
        <ElTabPane label="商品分类联动" name="product">
          <ElCard header="分类-品牌-产品联动">
            <ArtForm
              v-model="productFormData"
              :items="productFormItems"
              label-width="120px"
              :span="24"
            />
            <ElDivider />
            <pre>{{ productFormData }}</pre>
          </ElCard>
        </ElTabPane>

        <!-- 示例4: 计算字段 -->
        <ElTabPane label="计算字段" name="calc">
          <ElCard header="自动计算总价">
            <ArtForm v-model="calcFormData" :items="calcFormItems" label-width="120px" />
            <ElDivider />
            <pre>{{ calcFormData }}</pre>
          </ElCard>
        </ElTabPane>
      </ElTabs>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import type { FormItem, DepChangeParams } from '@/types/component/form'
  import ArtForm from '@/components/core/forms/c-form/index.vue'

  defineOptions({ name: 'DependencyExample' })

  const activeTab = ref('basic')

  // ===== 示例1: 基础依赖回调 =====
  const basicFormData = ref({
    age: 0,
    ageCategory: '',
    userType: 'personal',
    companyName: ''
  })

  const basicFormItems: FormItem[] = [
    {
      key: 'age',
      label: '年龄',
      type: 'number',
      required: true,
      props: {
        min: 0,
        max: 120,
        placeholder: '请输入年龄'
      }
    },
    {
      key: 'ageCategory',
      label: '年龄段',
      type: 'input',
      readonly: true,
      dependencies: ['age'],
      help: '根据年龄自动分类',
      onDepChange: ({ formApi, changedKey, changedValue }: DepChangeParams) => {
        if (changedKey === 'age') {
          let category = ''
          if (changedValue < 18) {
            category = '未成年'
          } else if (changedValue < 35) {
            category = '青年'
          } else if (changedValue < 60) {
            category = '中年'
          } else {
            category = '老年'
          }
          formApi.setFieldValue('ageCategory', category)
        }
      }
    },
    {
      key: 'userType',
      label: '用户类型',
      type: 'select',
      defaultValue: 'personal',
      props: {
        options: [
          { label: '个人用户', value: 'personal' },
          { label: '企业用户', value: 'company' }
        ]
      }
    },
    {
      key: 'companyName',
      label: '企业名称',
      type: 'input',
      hidden: (formData) => formData.userType !== 'company',
      dependencies: ['userType'],
      required: true,
      help: '切换到个人用户时自动清空',
      onDepChange: ({ formApi, changedKey, changedValue }: DepChangeParams) => {
        // 切换到个人用户时，清空企业名称
        if (changedKey === 'userType' && changedValue === 'personal') {
          formApi.setFieldValue('companyName', '')
        }
      }
    }
  ]

  // ===== 示例2: 地区级联（模拟 API）=====
  const regionFormData = ref({
    province: '',
    city: '',
    district: ''
  })

  // 模拟省份数据
  const mockProvinceList = () =>
    Promise.resolve({
      data: [
        { name: '北京市', code: 'beijing' },
        { name: '广东省', code: 'guangdong' },
        { name: '上海市', code: 'shanghai' }
      ]
    })

  // 模拟城市数据
  const mockCityList = (params: any) => {
    const cityMap: Record<string, any[]> = {
      beijing: [
        { name: '北京市', code: 'beijing-city' },
        { name: '海淀区', code: 'haidian' }
      ],
      guangdong: [
        { name: '广州市', code: 'guangzhou' },
        { name: '深圳市', code: 'shenzhen' }
      ],
      shanghai: [
        { name: '上海市', code: 'shanghai-city' },
        { name: '浦东新区', code: 'pudong' }
      ]
    }
    return Promise.resolve({
      data: cityMap[params.provinceCode] || []
    })
  }

  // 模拟区县数据
  const mockDistrictList = (params: any) => {
    const districtMap: Record<string, any[]> = {
      haidian: [
        { name: '中关村街道', code: 'zhongguancun' },
        { name: '西三旗街道', code: 'xisanqi' }
      ],
      guangzhou: [
        { name: '天河区', code: 'tianhe' },
        { name: '越秀区', code: 'yuexiu' }
      ],
      shenzhen: [
        { name: '南山区', code: 'nanshan' },
        { name: '福田区', code: 'futian' }
      ]
    }
    return Promise.resolve({
      data: districtMap[params.cityCode] || []
    })
  }

  const regionFormItems: FormItem[] = [
    {
      key: 'province',
      label: '省份',
      type: 'api-select',
      required: true,
      props: {
        api: mockProvinceList,
        labelField: 'name',
        valueField: 'code',
        placeholder: '请选择省份'
      }
    },
    {
      key: 'city',
      label: '城市',
      type: 'api-select',
      required: true,
      dependencies: ['province'],
      help: '请先选择省份',
      props: {
        api: mockCityList,
        labelField: 'name',
        valueField: 'code',
        placeholder: '请选择城市',
        paramsMapping: (formData: Record<string, any>) => ({
          provinceCode: formData.province
        })
      },
      onDepChange: ({ formApi, changedKey }: DepChangeParams) => {
        if (changedKey === 'province') {
          // 省份变化时，清空城市和区县
          formApi.setFieldValue('city', '')
          formApi.setFieldValue('district', '')
          // 触发城市选择器重新加载
          const cityInstance = formApi.getFieldInstance('city')
          if (cityInstance?.refresh) {
            cityInstance.refresh()
          }
        }
      }
    },
    {
      key: 'district',
      label: '区县',
      type: 'api-select',
      required: true,
      dependencies: ['city'],
      help: '请先选择城市',
      props: {
        api: mockDistrictList,
        labelField: 'name',
        valueField: 'code',
        placeholder: '请选择区县',
        paramsMapping: (formData: Record<string, any>) => ({
          cityCode: formData.city
        })
      },
      onDepChange: ({ formApi, changedKey }: DepChangeParams) => {
        if (changedKey === 'city') {
          // 城市变化时，清空区县
          formApi.setFieldValue('district', '')
          // 触发区县选择器重新加载
          const districtInstance = formApi.getFieldInstance('district')
          if (districtInstance?.refresh) {
            districtInstance.refresh()
          }
        }
      }
    }
  ]

  // ===== 示例3: 商品分类联动 =====
  const productFormData = ref({
    category: '',
    brand: '',
    product: ''
  })

  // 模拟分类数据
  const mockCategoryList = () =>
    Promise.resolve({
      data: [
        { name: '电子产品', id: 'electronics' },
        { name: '服装', id: 'clothing' },
        { name: '食品', id: 'food' }
      ]
    })

  // 模拟品牌数据
  const mockBrandList = (params: any) => {
    const brandMap: Record<string, any[]> = {
      electronics: [
        { name: '苹果', id: 'apple' },
        { name: '华为', id: 'huawei' }
      ],
      clothing: [
        { name: '耐克', id: 'nike' },
        { name: '阿迪达斯', id: 'adidas' }
      ],
      food: [
        { name: '三只松鼠', id: 'squirrel' },
        { name: '良品铺子', id: 'bestore' }
      ]
    }
    return Promise.resolve({
      data: brandMap[params.categoryId] || []
    })
  }

  // 模拟产品数据
  const mockProductList = (params: any) => {
    const productMap: Record<string, any[]> = {
      apple: [
        { name: 'iPhone 15', id: 'iphone15' },
        { name: 'MacBook Pro', id: 'macbook' }
      ],
      huawei: [
        { name: 'Mate 60', id: 'mate60' },
        { name: 'MateBook', id: 'matebook' }
      ],
      nike: [
        { name: 'Air Jordan', id: 'jordan' },
        { name: 'Air Force 1', id: 'af1' }
      ]
    }
    return Promise.resolve({
      data: productMap[params.brandId] || []
    })
  }

  const productFormItems: FormItem[] = [
    {
      key: 'category',
      label: '产品分类',
      type: 'api-select',
      required: true,
      props: {
        api: mockCategoryList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择分类'
      }
    },
    {
      key: 'brand',
      label: '品牌',
      type: 'api-select',
      required: true,
      dependencies: ['category'],
      help: '根据分类动态加载品牌',
      props: {
        api: mockBrandList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请先选择分类',
        paramsMapping: (formData: Record<string, any>) => ({
          categoryId: formData.category
        })
      },
      onDepChange: ({ formApi, changedKey }: DepChangeParams) => {
        if (changedKey === 'category') {
          // 分类变化时，清空品牌和产品
          formApi.setFieldValue('brand', '')
          formApi.setFieldValue('product', '')
          // 重新加载品牌数据
          formApi.getFieldInstance('brand')?.refresh()
        }
      }
    },
    {
      key: 'product',
      label: '产品',
      type: 'api-select',
      required: true,
      dependencies: ['brand'],
      help: '根据品牌动态加载产品',
      props: {
        api: mockProductList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请先选择品牌',
        paramsMapping: (formData: Record<string, any>) => ({
          brandId: formData.brand
        })
      },
      onDepChange: ({ formApi, changedKey }: DepChangeParams) => {
        if (changedKey === 'brand') {
          // 品牌变化时，清空产品
          formApi.setFieldValue('product', '')
          // 重新加载产品数据
          formApi.getFieldInstance('product')?.refresh()
        }
      }
    }
  ]

  // ===== 示例4: 计算字段 =====
  const calcFormData = ref({
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    discount: 0,
    finalPrice: 0
  })

  const calcFormItems: FormItem[] = [
    {
      key: 'quantity',
      label: '数量',
      type: 'number',
      required: true,
      defaultValue: 1,
      props: {
        min: 1,
        max: 999
      }
    },
    {
      key: 'unitPrice',
      label: '单价',
      type: 'number',
      required: true,
      props: {
        min: 0,
        precision: 2,
        placeholder: '请输入单价'
      }
    },
    {
      key: 'totalPrice',
      label: '总价',
      type: 'number',
      readonly: true,
      dependencies: ['quantity', 'unitPrice'],
      help: '自动计算：数量 × 单价',
      onDepChange: ({ formApi }: DepChangeParams) => {
        const quantity = formApi.getFieldValue('quantity') || 0
        const unitPrice = formApi.getFieldValue('unitPrice') || 0
        const totalPrice = quantity * unitPrice
        formApi.setFieldValue('totalPrice', totalPrice)

        // 同时触发最终价格的计算
        const discount = formApi.getFieldValue('discount') || 0
        formApi.setFieldValue('finalPrice', totalPrice - discount)
      }
    },
    {
      key: 'discount',
      label: '优惠金额',
      type: 'number',
      props: {
        min: 0,
        precision: 2,
        placeholder: '请输入优惠金额'
      }
    },
    {
      key: 'finalPrice',
      label: '最终价格',
      type: 'number',
      readonly: true,
      dependencies: ['totalPrice', 'discount'],
      help: '自动计算：总价 - 优惠',
      onDepChange: ({ formApi }: DepChangeParams) => {
        const totalPrice = formApi.getFieldValue('totalPrice') || 0
        const discount = formApi.getFieldValue('discount') || 0
        formApi.setFieldValue('finalPrice', totalPrice - discount)
      }
    }
  ]
</script>
<style lang="scss" scoped>
  .dependency-example-page {
    padding: 20px;

    pre {
      padding: 10px;
      margin-top: 10px;
      overflow-x: auto;
      background-color: #f5f7fa;
      border-radius: 4px;
    }

    :deep(.el-card) {
      margin-bottom: 20px;
    }
  }
</style>

<template>
  <div class="page-content user">
    <div class="content">
      <div class="left-wrap">
        <div class="user-wrap box-style">
          <img class="bg" src="@imgs/user/bg.png" />
          <img class="avatar" :src="userInfo.avatar" />
          <h2 class="name">{{ userInfo.username }}</h2>
          <p class="des">Art Design Pro 是一款漂亮的后台管理系统模版.</p>

          <div class="outer-info">
            <div>
              <i class="iconfont-sys">&#xe72e;</i>
              <span>{{ userInfo.email || '-' }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe608;</i>
              <span>交互专家</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe736;</i>
              <span>广东省深圳市</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe811;</i>
              <span>字节跳动－某某平台部－UED</span>
            </div>
          </div>

          <div class="lables">
            <h3>标签</h3>
            <div>
              <div v-for="item in lableList" :key="item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <!-- <el-carousel class="gallery" height="160px"
          :interval="5000"
          indicator-position="none"
        >
          <el-carousel-item class="item" v-for="item in galleryList" :key="item">
            <img :src="item"/>
          </el-carousel-item>
        </el-carousel> -->
      </div>
      <div class="right-wrap">
        <div class="info box-style">
          <h1 class="title">基本设置</h1>

          <el-form
            :model="form"
            class="form"
            ref="ruleFormRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <el-row>
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="form.realName" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="性别" prop="sex" class="right-input">
                <el-select v-model="form.sex" placeholder="Select" :disabled="!isEdit">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="昵称" prop="nikeName">
                <el-input v-model="form.nikeName" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email" class="right-input">
                <el-input v-model="form.email" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="form.mobile" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="地址" prop="address" class="right-input">
                <el-input v-model="form.address" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-form-item label="个人介绍" prop="des" :style="{ height: '130px' }">
              <el-input type="textarea" :rows="4" v-model="form.des" :disabled="!isEdit" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" v-ripple @click="edit">
                {{ isEdit ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>

        <div class="info box-style" style="margin-top: 20px">
          <h1 class="title">更改密码</h1>

          <el-form
            :model="pwdForm"
            class="form"
            label-width="86px"
            label-position="top"
            ref="pwdFormRef"
            :rules="pwdRules"
          >
            <el-form-item label="当前密码" prop="password">
              <el-input v-model="pwdForm.password" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwdForm.newPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="pwdForm.confirmPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" v-ripple @click="editPwd">
                {{ isEditPwd ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/modules/user'
  import { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { UserService } from '@/api/usersApi'
  import { ApiStatus } from '@/utils/http/status'

  const userStore = useUserStore()
  const userInfo = computed(() => userStore.getUserInfo)

  const isEdit = ref(false)
  const isEditPwd = ref(false)
  const date = ref('')
  const form = reactive({
    realName: '',
    nikeName: '',
    email: '',
    mobile: '',
    address: '',
    sex: '2',
    des: ''
  })

  const pwdForm = reactive({
    password: '',
    newPassword: '',
    confirmPassword: ''
  })

  const ruleFormRef = ref<FormInstance>()
  const pwdFormRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    realName: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 30 个字符', trigger: 'blur' }
    ],
    nikeName: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 30 个字符', trigger: 'blur' }
    ],
    email: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
    sex: [{ type: 'array', required: true, message: '请选择性别', trigger: 'blur' }]
  })

  const pwdRules = reactive<FormRules>({
    password: [
      { required: true, message: '请输入当前密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度应在6-20之间', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度应在6-20之间', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度应在6-20之间', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== pwdForm.newPassword) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  })

  const options = [
    {
      value: '0',
      label: '未知'
    },
    {
      value: '1',
      label: '男'
    },
    {
      value: '2',
      label: '女'
    }
  ]

  const lableList: Array<string> = ['专注设计', '很有想法', '辣~', '大长腿', '川妹子', '海纳百川']

  onMounted(() => {
    getDate()
    initFormData()
  })

  const getDate = () => {
    const d = new Date()
    const h = d.getHours()
    let text = ''

    if (h >= 6 && h < 9) {
      text = '早上好'
    } else if (h >= 9 && h < 11) {
      text = '上午好'
    } else if (h >= 11 && h < 13) {
      text = '中午好'
    } else if (h >= 13 && h < 18) {
      text = '下午好'
    } else if (h >= 18 && h < 24) {
      text = '晚上好'
    } else if (h >= 0 && h < 6) {
      text = '很晚了，早点睡'
    }

    date.value = text
  }

  // 初始化表单数据
  const initFormData = () => {
    if (userInfo.value) {
      form.realName = userInfo.value.name || '-'
      form.nikeName = userInfo.value.username || '-'
      form.email = userInfo.value.email || '-'
      form.mobile = userInfo.value.mobile || '-'
      form.address = form.address || '-'
      form.sex = userInfo.value.gender !== undefined ? String(userInfo.value.gender) : '0'
      form.des = '奕尘 Easy Cloud 是一款漂亮的后台管理系统.'
    }
  }

  const edit = () => {
    if (isEdit.value) {
      // 保存数据前验证表单
      ruleFormRef.value?.validate(async (valid) => {
        if (valid) {
          // 保存成功后，更新用户信息
          if (userInfo.value && userInfo.value.id) {
            const updatedUserInfo = {
              id: userInfo.value.id,
              name: form.realName,
              username: form.nikeName,
              email: form.email,
              mobile: form.mobile,
              avatar: userInfo.value.avatar || '',
              gender: Number(form.sex),
              // 保留其他字段
              status: userInfo.value.status,
              roles: userInfo.value.roles,
              permissions: userInfo.value.permissions
            }

            // 调用API更新用户信息
            const res = await UserService.updateUserInfo(updatedUserInfo)

            if (res.code === ApiStatus.success) {
              // 更新本地用户信息
              userStore.setUserInfo(res.data)
              ElMessage.success('用户信息更新成功')
              // 切换为非编辑状态
              isEdit.value = false
            } else {
              ElMessage.error(res.message || '用户信息更新失败')
            }
          }
        }
      })
    } else {
      // 进入编辑状态
      isEdit.value = true
    }
  }

  const editPwd = () => {
    if (isEditPwd.value) {
      // 保存密码前验证表单
      pwdFormRef.value?.validate(async (valid) => {
        if (valid) {
          // 调用修改密码API
          const res = await UserService.updatePassword({
            oldPassword: pwdForm.password,
            newPassword: pwdForm.newPassword
          })

          if (res.code === ApiStatus.success) {
            ElMessage.success('密码修改成功')
            // 重置表单
            pwdForm.password = ''
            pwdForm.newPassword = ''
            pwdForm.confirmPassword = ''
            // 切换为非编辑状态
            isEditPwd.value = false
          } else {
            ElMessage.error(res.message || '密码修改失败')
          }
        }
      })
    } else {
      // 进入编辑状态
      isEditPwd.value = true
    }
  }
</script>

<style lang="scss">
  .user {
    .icon {
      width: 1.4em;
      height: 1.4em;
      overflow: hidden;
      vertical-align: -0.15em;
      fill: currentcolor;
    }
  }
</style>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    $box-radius: calc(var(--custom-radius) + 4px);

    .box-style {
      border: 1px solid var(--art-border-color);
    }

    .content {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .left-wrap {
        width: 450px;
        margin-right: 25px;

        .user-wrap {
          position: relative;
          height: 600px;
          padding: 35px 40px;
          overflow: hidden;
          text-align: center;
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .avatar {
            position: relative;
            z-index: 10;
            width: 80px;
            height: 80px;
            margin-top: 120px;
            object-fit: cover;
            border: 2px solid #fff;
            border-radius: 50%;
          }

          .name {
            margin-top: 20px;
            font-size: 22px;
            font-weight: 400;
          }

          .des {
            margin-top: 20px;
            font-size: 14px;
          }

          .outer-info {
            width: 300px;
            margin: auto;
            margin-top: 30px;
            text-align: left;

            > div {
              margin-top: 10px;

              span {
                margin-left: 8px;
                font-size: 14px;
              }
            }
          }

          .lables {
            margin-top: 40px;

            h3 {
              font-size: 15px;
              font-weight: 500;
            }

            > div {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              margin-top: 15px;

              > div {
                padding: 3px 6px;
                margin: 0 10px 10px 0;
                font-size: 12px;
                background: var(--art-main-bg-color);
                border: 1px solid var(--art-border-color);
                border-radius: 2px;
              }
            }
          }
        }

        .gallery {
          margin-top: 25px;
          border-radius: 10px;

          .item {
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }

      .right-wrap {
        flex: 1;
        overflow: hidden;
        border-radius: $box-radius;

        .info {
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .title {
            padding: 15px 25px;
            font-size: 20px;
            font-weight: 400;
            color: var(--art-text-gray-800);
            border-bottom: 1px solid var(--art-border-color);
          }

          .form {
            box-sizing: border-box;
            padding: 30px 25px;

            > .el-row {
              .el-form-item {
                width: calc(50% - 10px);
              }

              .el-input,
              .el-select {
                width: 100%;
              }
            }

            .right-input {
              margin-left: 20px;
            }

            .el-form-item-right {
              display: flex;
              align-items: center;
              justify-content: end;

              .el-button {
                width: 110px !important;
              }
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: $device-ipad-vertical) {
    .page-content {
      .content {
        display: block;
        margin-top: 5px;

        .left-wrap {
          width: 100%;
        }

        .right-wrap {
          width: 100%;
          margin-top: 15px;
        }
      }
    }
  }
</style>

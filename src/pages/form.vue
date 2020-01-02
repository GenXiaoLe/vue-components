<template>
  <KForm :model="info" :rules="rules" ref="KForm">
    <KFormItem label="用户名：" prop="userName">
        <KInput v-model="info.userName" placeholder="请输入用户名" />
    </KFormItem>
    <KFormItem label="密码：" prop="userPassword" >
        <KInput type="password" v-model="info.userPassword" placeholder="请输入密码"/>
    </KFormItem>
    <KFormItem>
        <button @click="save">提交</button>
    </KFormItem>
</KForm>
</template>

<script>
import KForm from '@/package/kForm/KForm';
import KInput from "@/package/kForm/KInput";
import KFormItem from '@/package/kForm/KFormItem';
export default {
  name: 'app',
  components: {
    KInput,
    KFormItem,
    KForm
  },
  data() {
    return {
      info: {
        userName: '',
        userPassword: ''
      },
      rules: {
        userName: { required: true, message: '用户名不能为空' },
        userPassword: { required: true, message: '密码不能为空' }
      }
    }
  },
  methods: {
    save() {
      this.$refs.KForm.validate((result) => {
        let message = '校验通过';
        if (!result) {
            message = '校验未通过';
        }

        const notice = this.$create(this.$native, {
            title: '自定义弹窗',
            message,
            duration: 1000
        });
        notice.show();
      })
    }
  }
}
</script>

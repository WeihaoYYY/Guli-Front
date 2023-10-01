<template>
    <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
        </el-form-item>

        <el-form-item>
            <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
            </el-select>
        </el-form-item>

        <el-form-item label="添加时间">
            <el-date-picker
            v-model="teacherQuery.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            />
        </el-form-item>
        <el-form-item>
            <el-date-picker
            v-model="teacherQuery.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            />
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>


        <el-table 
            :data="list"
            border
            fit
            highlight-current-row >

            <el-table-column label="序号" width="70" align="center">
            <template slot-scope="scope">
                {{ (page - 1) * limit + scope.$index + 1 }}
              <!-- <el-checkbox v-model="multipleSelection" :label="scope.row"></el-checkbox> -->
            </template>
            </el-table-column>

            <el-table-column label="讲师姓名" width="80" prop="name"/>

            <el-table-column label="讲师级别" width="80" prop="level">
                <template slot-scope="scope">
                    {{scope.row.level === 1 ? '高级讲师' : scope.row.level === 2 ? '首席讲师' : '特级讲师'}}
                </template>
            </el-table-column>
            
            <el-table-column label="讲师资历" prop="intro"/>

            <el-table-column label="添加时间" width="160" prop="gmtCreate"/>

            <el-table-column label="排序" width="60" prop="sort" align="center"/>

            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/teacher/edit/'+scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    </router-link>
                    
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>




        <el-pagination
            @current-change="getList" 
            :current-page="page"  
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="limit"
            layout="total, prev, pager, next, jumper"
            style="padding: 30px 0; text-align: center;"
            :total="total">
        </el-pagination>


        
    </div>
</template>

<script>
import teacher from "@/api/edu/teacher";

export default {

    data(){  //定义 要用到的变量的 变量和初始值，比如说getTeacherListPage(current, limit, teacherQuery)
        return{
            list:null,  //查询之后接口返回的集合
            page:1,  //当前页码
            limit:10,  //每页显示的条数
            total:0,  //总记录数
            teacherQuery:{  //查询条件，里面的属性不一定需要在这里定义
            }
        }
    },
    created(){  //在页面渲染之前执行
        this.getList();
        
    },
    methods:{  //定义方法
        getList(page=1) {
            this.page = page;
            teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
                .then(response => {  //response: 接口返回的数据
                    //console.log(response);
                    this.list = response.data.rows;  //接口返回的集合
                    this.total = response.data.total;  //接口返回的总记录数
                    console.log(this.list);
                })
                .catch(error => {
                    console.log(error);
                })
        },
        resetData() {//清空的方法
            //表单输入项数据清空
            this.teacherQuery = {}
            //查询所有讲师数据
            this.getList()
        },
        removeDataById(id) {
            this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                teacher.deleteTeacherId(id)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //回到列表页面
                    this.getList()
                })
            }) //点击取消，执行catch方法
        }

        
        
    }


    
}
</script>

<style>

</style>
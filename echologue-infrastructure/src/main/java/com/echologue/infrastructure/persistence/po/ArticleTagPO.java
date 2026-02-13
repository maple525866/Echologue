package com.echologue.infrastructure.persistence.po;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文章标签关联持久化对象
 *
 * @author Echologue
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("article_tag")
public class ArticleTagPO {
    
    /**
     * 文章ID
     */
    private Long articleId;
    
    /**
     * 标签ID
     */
    private Long tagId;
}

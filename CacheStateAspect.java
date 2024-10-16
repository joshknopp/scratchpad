import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import java.lang.reflect.Method;

@Component
@Aspect
public class CacheStateAspect {

    private final RedisTemplate<String, Object> redisTemplate;
    private final KeyGenerator customKeyGenerator;

    public CacheStateAspect(RedisTemplate<String, Object> redisTemplate, KeyGenerator customKeyGenerator) {
        this.redisTemplate = redisTemplate;
        this.customKeyGenerator = customKeyGenerator;
    }

    @Around("@annotation(cacheable)")
    public Object trackCacheState(ProceedingJoinPoint pjp, Cacheable cacheable) throws Throwable {
        // Extract the method and its parameters from the join point
        Method method = ((MethodSignature) pjp.getSignature()).getMethod();
        Object[] args = pjp.getArgs();

        // Generate the cache key using your custom key generator
        String cacheKey = (String) customKeyGenerator.generate(pjp.getTarget(), method, args);
        String cacheName = cacheable.cacheNames()[0];
        String redisKey = cacheName + "::" + cacheKey;

        // Check the cache state in Redis
        if (redisTemplate.hasKey(redisKey)) {
            logCacheState(cacheKey, CacheState.COMPLETED);
            return pjp.proceed();  // Return cached value if it exists
        }

        // Set "In Progress" state
        logCacheState(cacheKey, CacheState.IN_PROGRESS);

        // Execute the method and cache the result
        Object result = pjp.proceed();

        // Update the cache state to "Completed" after method execution
        logCacheState(cacheKey, CacheState.COMPLETED);

        return result;
    }

    private void logCacheState(String cacheKey, CacheState state) {
        // Log or persist the state, as needed
        System.out.println("Cache key: " + cacheKey + " is in state: " + state);
        // Optionally persist this information in the database
    }
}
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api.dart';

enum ApiHealth { online, degraded, unreachable }

final apiHealthProvider = FutureProvider.autoDispose<ApiHealth>((ref) async {
  try {
    // Read raw JSON: the spec documents both 200 and 503 bodies for this route.
    final res = await ref
        .watch(apiProvider)
        .dio
        .get<Map<String, dynamic>>('/api/v1/health');
    return res.data?['status'] == 'ok' ? ApiHealth.online : ApiHealth.degraded;
  } on DioException catch (e) {
    // 503 still means the API answered; one of its dependencies is down.
    return e.response?.statusCode == 503
        ? ApiHealth.degraded
        : ApiHealth.unreachable;
  } catch (_) {
    return ApiHealth.unreachable;
  }
});

// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'department_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$DepartmentDtoCWProxy {
  DepartmentDto id(String id);

  DepartmentDto name(String name);

  DepartmentDto costCentre(String? costCentre);

  DepartmentDto hod(DepartmentHodDto? hod);

  DepartmentDto memberCount(num memberCount);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `DepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// DepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  DepartmentDto call({
    String id,
    String name,
    String? costCentre,
    DepartmentHodDto? hod,
    num memberCount,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfDepartmentDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfDepartmentDto.copyWith.fieldName(...)`
class _$DepartmentDtoCWProxyImpl implements _$DepartmentDtoCWProxy {
  const _$DepartmentDtoCWProxyImpl(this._value);

  final DepartmentDto _value;

  @override
  DepartmentDto id(String id) => this(id: id);

  @override
  DepartmentDto name(String name) => this(name: name);

  @override
  DepartmentDto costCentre(String? costCentre) => this(costCentre: costCentre);

  @override
  DepartmentDto hod(DepartmentHodDto? hod) => this(hod: hod);

  @override
  DepartmentDto memberCount(num memberCount) => this(memberCount: memberCount);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `DepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// DepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  DepartmentDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
    Object? costCentre = const $CopyWithPlaceholder(),
    Object? hod = const $CopyWithPlaceholder(),
    Object? memberCount = const $CopyWithPlaceholder(),
  }) {
    return DepartmentDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String,
      costCentre: costCentre == const $CopyWithPlaceholder()
          ? _value.costCentre
          // ignore: cast_nullable_to_non_nullable
          : costCentre as String?,
      hod: hod == const $CopyWithPlaceholder()
          ? _value.hod
          // ignore: cast_nullable_to_non_nullable
          : hod as DepartmentHodDto?,
      memberCount: memberCount == const $CopyWithPlaceholder()
          ? _value.memberCount
          // ignore: cast_nullable_to_non_nullable
          : memberCount as num,
    );
  }
}

extension $DepartmentDtoCopyWith on DepartmentDto {
  /// Returns a callable class that can be used as follows: `instanceOfDepartmentDto.copyWith(...)` or like so:`instanceOfDepartmentDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$DepartmentDtoCWProxy get copyWith => _$DepartmentDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DepartmentDto _$DepartmentDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('DepartmentDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'name', 'memberCount']);
      final val = DepartmentDto(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        costCentre: $checkedConvert('costCentre', (v) => v as String?),
        hod: $checkedConvert(
          'hod',
          (v) => v == null
              ? null
              : DepartmentHodDto.fromJson(v as Map<String, dynamic>),
        ),
        memberCount: $checkedConvert('memberCount', (v) => v as num),
      );
      return val;
    });

Map<String, dynamic> _$DepartmentDtoToJson(DepartmentDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'costCentre': ?instance.costCentre,
      'hod': ?instance.hod?.toJson(),
      'memberCount': instance.memberCount,
    };
